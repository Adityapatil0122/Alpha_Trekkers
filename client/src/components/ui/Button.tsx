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
    'bg-gradient-to-r from-forest-500 to-forest-600 text-white shadow-[0_18px_38px_rgba(34,120,69,0.28)] hover:translate-y-[-1px] hover:from-forest-400 hover:to-forest-500',
  secondary:
    'border border-ink-900/12 bg-white text-ink-800 hover:border-forest-500/30 hover:bg-sand-100',
  accent:
    'bg-gradient-to-r from-gold-500 to-coral-500 text-ink-950 shadow-[0_18px_38px_rgba(223,157,53,0.28)] hover:translate-y-[-1px] hover:from-gold-400 hover:to-coral-500',
  ghost:
    'bg-transparent text-ink-800 hover:bg-ink-900/5',
  danger:
    'bg-coral-500 text-white shadow-[0_18px_38px_rgba(191,79,58,0.22)] hover:bg-coral-600',
};

const sizeClasses: Record<Size, string> = {
  sm: 'gap-1.5 rounded-full px-4 py-2 text-sm',
  md: 'gap-2 rounded-full px-6 py-3 text-sm',
  lg: 'gap-2.5 rounded-full px-7 py-3.5 text-base',
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
  ) => (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-medium transition duration-200 disabled:cursor-not-allowed disabled:opacity-55 ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`.trim()}
      {...props}
    >
      {isLoading ? (
        <SpinnerGap className="h-5 w-5 animate-spin" />
      ) : (
        <>
          {leftIcon ? <span className="shrink-0">{leftIcon}</span> : null}
          {children}
          {rightIcon ? <span className="shrink-0">{rightIcon}</span> : null}
        </>
      )}
    </button>
  ),
);

Button.displayName = 'Button';

export default Button;
