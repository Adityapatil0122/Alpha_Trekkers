import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { SpinnerGap } from '@phosphor-icons/react';

type Variant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-forest-500 text-white shadow-lg shadow-forest-500/25 hover:bg-forest-400 hover:shadow-forest-400/30 active:bg-forest-600',
  secondary:
    'border-2 border-forest-500 text-forest-700 hover:bg-forest-500 hover:text-white active:bg-forest-600',
  accent:
    'bg-amber-500 text-white shadow-lg shadow-amber-500/25 hover:bg-amber-400 hover:shadow-amber-400/30 active:bg-amber-600',
  ghost:
    'text-forest-700 hover:bg-forest-100 active:bg-forest-200',
  danger:
    'bg-red-500 text-white shadow-lg shadow-red-500/25 hover:bg-red-400 active:bg-red-600',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm rounded-lg gap-1.5',
  md: 'px-6 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-8 py-3.5 text-base rounded-xl gap-2.5',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      disabled,
      className = '',
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          inline-flex items-center justify-center font-semibold transition-all duration-300
          disabled:cursor-not-allowed disabled:opacity-50
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `.trim()}
        {...props}
      >
        {isLoading ? (
          <SpinnerGap className="h-5 w-5 animate-spin" />
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;
