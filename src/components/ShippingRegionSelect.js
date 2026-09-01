import React from 'react';
import { useId, useRef, useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './BuyButton.css';

const SHIP_REGIONS = [
  { id: 'bg', feeKey: 'ship_bg' },
  { id: 'eu', feeKey: 'ship_eu' },
  { id: 'uk', feeKey: 'ship_uk' },
];

export const ShippingRegionSelect = ({
  id,
  value,
  onChange,
  disabled = false,
}) => {
  const { t } = useLanguage();
  const reactId = useId();
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const listId = id ? `${id}-list` : `ship-region-list-${reactId}`;
  const buttonId = id || `ship-region-${reactId}`;
  const selected =
    SHIP_REGIONS.find((region) => region.id === value) || SHIP_REGIONS[0];

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const onPointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (disabled) {
      setOpen(false);
    }
  }, [disabled]);

  const chooseRegion = (regionId) => {
    onChange(regionId);
    setOpen(false);
  };

  return (
    <div
      ref={rootRef}
      className={`buy-ship-region${open ? ' is-open' : ''}${
        disabled ? ' is-disabled' : ''
      }`}
    >
      <span className="buy-ship-region__label" id={`${buttonId}-label`}>
        {t('shop.ship_to')}
      </span>
      <div className="buy-ship-region__select-wrap">
        <button
          type="button"
          id={buttonId}
          className="buy-ship-region__trigger"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-labelledby={`${buttonId}-label ${buttonId}`}
          disabled={disabled}
          onClick={() => setOpen((current) => !current)}
        >
          <span className="buy-ship-region__value">{t(`shop.${selected.feeKey}`)}</span>
          <i
            className={`bi ${open ? 'bi-chevron-up' : 'bi-chevron-down'} buy-ship-region__chevron`}
            aria-hidden="true"
          />
        </button>

        {open && (
          <ul
            id={listId}
            className="buy-ship-region__menu"
            role="listbox"
            aria-labelledby={`${buttonId}-label`}
          >
            {SHIP_REGIONS.map((region) => {
              const isActive = region.id === selected.id;
              return (
                <li key={region.id} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    className={`buy-ship-region__option${isActive ? ' is-active' : ''}`}
                    onClick={() => chooseRegion(region.id)}
                  >
                    <span>{t(`shop.${region.feeKey}`)}</span>
                    {isActive ? (
                      <i className="bi bi-check2" aria-hidden="true" />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
