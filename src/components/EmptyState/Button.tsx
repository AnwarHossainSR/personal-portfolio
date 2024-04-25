'use client';

import type { IconType } from 'react-icons';

interface ButtonProps {
  label: string;
  // eslint-disable-next-line no-unused-vars
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  icon?: IconType;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled,
  outline,
  small,
  icon: Icon,
  isLoading,
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        position: 'relative',
        opacity: disabled ? '0.7' : '1',
        cursor: disabled ? 'not-allowed' : 'pointer',
        borderRadius: '0.5rem',
        transition: 'opacity 0.3s',
        width: '100%',
        backgroundColor: outline ? 'white' : '#f43f5e',
        border: outline ? '1px solid black' : '2px solid #f43f5e',
        color: outline ? 'black' : 'white',
        fontSize: small ? '0.875rem' : '1rem',
        padding: small ? '0.25rem 0.5rem' : '0.75rem 1.5rem',
        fontWeight: small ? '300' : '600',
      }}
    >
      {Icon && (
        <Icon
          size={24}
          style={{
            position: 'absolute',
            left: '1rem',
            top: '0.75rem',
          }}
        />
      )}
      {isLoading ? 'Loading...' : label}
    </button>
  );
};

export default Button;
