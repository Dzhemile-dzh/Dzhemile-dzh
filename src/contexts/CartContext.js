import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const STORAGE_KEY = 'doarti_basket_v1';
const SHIP_FEES = { bg: 0, eu: 35, uk: 45 };

const CartContext = createContext(undefined);

export const cartLineId = ({ productType, productId, sizeLabel }) =>
  `${productType}::${productId}::${sizeLabel ?? ''}`;

const readStoredCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (typeof raw !== 'string' || raw.length === 0) {
      return { items: [], shippingRegion: 'bg' };
    }

    const parsed = JSON.parse(raw);
    const items = Array.isArray(parsed.items) ? parsed.items : [];
    const shippingRegion =
      parsed.shippingRegion === 'eu' || parsed.shippingRegion === 'uk'
        ? parsed.shippingRegion
        : 'bg';

    return { items, shippingRegion };
  } catch {
    return { items: [], shippingRegion: 'bg' };
  }
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => readStoredCart().items);
  const [shippingRegion, setShippingRegion] = useState(
    () => readStoredCart().shippingRegion
  );

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ items, shippingRegion })
    );
  }, [items, shippingRegion]);

  const addItem = useCallback((item) => {
    const id = cartLineId(item);

    setItems((current) => {
      const existing = current.find((entry) => entry.id === id);
      if (existing) {
        if (item.productType === 'print') {
          return current.map((entry) =>
            entry.id === id
              ? { ...entry, quantity: entry.quantity + 1 }
              : entry
          );
        }

        return current;
      }

      return [
        ...current,
        {
          id,
          productType: item.productType === 'print' ? 'print' : 'original',
          productId: item.productId,
          title: item.title,
          priceEur: Number(item.priceEur),
          imagePath: item.imagePath,
          sizeLabel: item.sizeLabel ?? null,
          quantity: 1,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems((current) => current.filter((entry) => entry.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const hasItem = useCallback(
    (item) => items.some((entry) => entry.id === cartLineId(item)),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((total, entry) => total + entry.quantity, 0),
    [items]
  );

  const subtotalEur = useMemo(
    () =>
      items.reduce(
        (total, entry) => total + Number(entry.priceEur) * entry.quantity,
        0
      ),
    [items]
  );

  const shippingEur = SHIP_FEES[shippingRegion] ?? 0;

  const value = {
    items,
    itemCount,
    shippingRegion,
    setShippingRegion,
    shippingEur,
    subtotalEur,
    totalEur: subtotalEur + shippingEur,
    addItem,
    removeItem,
    clearCart,
    hasItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
