import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import './BuyButton.css';

export { ShippingRegionSelect } from './ShippingRegionSelect';

const BuyButton = ({
  productType,
  productId,
  title,
  priceEur,
  imagePath,
  sold = false,
  className = '',
  sizeLabel = null,
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { addItem, hasItem } = useCart();
  const [error, setError] = useState(null);

  if (sold === true) {
    return null;
  }

  const numericPrice = Number(priceEur);
  const canBuy = Number.isFinite(numericPrice) && numericPrice > 0;
  const inBasket = hasItem({ productType, productId, sizeLabel });

  const handleClick = () => {
    setError(null);

    if (!canBuy) {
      setError(t('shop.price_unavailable'));
      return;
    }

    if (inBasket) {
      navigate('/basket');
      return;
    }

    addItem({
      productType,
      productId,
      title,
      priceEur: numericPrice,
      imagePath,
      sizeLabel,
    });
  };

  return (
    <div className={`buy-button-block ${className}`.trim()}>
      <button
        type="button"
        className="btn buy-action-btn doarti-cta"
        onClick={handleClick}
        disabled={!canBuy}
      >
        <span className="doarti-cta__label buy-action-btn__label">
          {inBasket ? t('shop.in_basket') : t('shop.add_to_basket')}
        </span>
        <span className="doarti-cta__icon buy-action-btn__icon" aria-hidden="true">
          <i className={`bi ${inBasket ? 'bi-bag-check' : 'bi-bag-plus'}`} />
        </span>
      </button>
      {error !== null && (
        <p className="text-danger small mt-2 mb-0">{error}</p>
      )}
    </div>
  );
};

export default BuyButton;
