import { useEffect } from 'react';
import { X } from '@phosphor-icons/react';
import Button from '@/components/ui/Button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: React.ReactNode;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  icon,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink-950/50 px-4 py-8 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="travel-panel relative w-full max-w-lg rounded-[2rem] border border-white/80 p-6 shadow-[0_32px_90px_rgba(15,23,42,0.2)] sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-sand-100 text-ink-500 transition hover:bg-sand-200"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {icon ? (
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-coral-500/12 text-coral-600">
            {icon}
          </span>
        ) : null}
        <p className="mt-5 text-xs uppercase tracking-[0.18em] text-coral-600">Confirmation</p>
        <h2 className="mt-2 font-heading text-3xl text-ink-900 sm:text-4xl">{title}</h2>
        <div className="mt-3 text-sm leading-7 text-ink-700/78 sm:text-[0.95rem]">{description}</div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
