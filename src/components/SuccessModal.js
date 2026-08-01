import React, { useEffect } from 'react';
import './SuccessModal.css';

const SuccessModal = ({
  title,
  message,
  note,
  closeLabel,
  onClose,
  variant = 'success',
}) => {
  const isInfo = variant === 'info';

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div className="doarti-modal-overlay" onClick={onClose} role="presentation">
      <div
        className={`doarti-modal${isInfo ? ' doarti-modal--info' : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="doarti-modal-title"
      >
        <div className="doarti-modal__header">
          <img
            src="/images/logo-doarti.png"
            alt=""
            className="doarti-modal__logo"
            width="48"
            height="48"
          />
          <div className="doarti-modal__brand">DOARTI</div>
          <div className="doarti-modal__brand-sub">BY DZHEMILE AHMED</div>
        </div>

        <div className="doarti-modal__body">
          <div
            className={`doarti-modal__icon${isInfo ? ' doarti-modal__icon--info' : ''}`}
            aria-hidden="true"
          >
            {isInfo ? 'i' : '✓'}
          </div>
          <h3 id="doarti-modal-title">{title}</h3>
          {typeof message === 'string' && message.length > 0 && <p>{message}</p>}
          {typeof note === 'string' && note.length > 0 && (
            <p className="doarti-modal__note">{note}</p>
          )}
          <button type="button" className="doarti-modal__btn" onClick={onClose}>
            {closeLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
