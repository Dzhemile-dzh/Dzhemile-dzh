import React from 'react';
import { Link } from 'react-router-dom';

const DoartiCta = ({
  to,
  href,
  type = 'button',
  icon,
  children,
  className = '',
  disabled = false,
  onClick,
  target,
  rel,
  ...rest
}) => {
  const classes = ['doarti-cta', className].filter(Boolean).join(' ');
  const hasIcon = typeof icon === 'string' && icon.length > 0;

  const content = (
    <>
      <span className="doarti-cta__label">{children}</span>
      {hasIcon ? (
        <span className="doarti-cta__icon" aria-hidden="true">
          <i className={`bi ${icon}`} />
        </span>
      ) : null}
    </>
  );

  if (typeof to === 'string' && to.length > 0) {
    return (
      <Link to={to} className={classes} onClick={onClick} {...rest}>
        {content}
      </Link>
    );
  }

  if (typeof href === 'string' && href.length > 0) {
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        target={target}
        rel={rel}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {content}
    </button>
  );
};

export default DoartiCta;
