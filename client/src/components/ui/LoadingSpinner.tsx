import { Mountains } from '@phosphor-icons/react';

interface LoadingSpinnerProps {
  fullPage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function LoadingSpinner({
  fullPage = false,
  size = 'md',
  text,
}: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const spinner = (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {/* Outer ring */}
        <div
          className={`animate-spin rounded-full border-2 border-forest-200 border-t-forest-500 ${
            size === 'sm' ? 'h-10 w-10' : size === 'md' ? 'h-16 w-16' : 'h-24 w-24'
          }`}
        />
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Mountains
            className={`text-forest-500 animate-float ${sizeMap[size]}`}
            weight="duotone"
          />
        </div>
      </div>
      {text && (
        <p className="animate-pulse text-sm font-medium text-forest-600">{text}</p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-forest-50">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-12">{spinner}</div>;
}
