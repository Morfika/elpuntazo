import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ConfirmDialogProps {
  trigger: React.ReactNode;
  title?: string;
  description?: string;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'destructive' | 'default';
}

const ConfirmDialog = ({
  trigger,
  title = '¿Estás seguro?',
  description = 'Esta acción no se puede deshacer.',
  onConfirm,
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  variant = 'destructive',
}: ConfirmDialogProps) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
        <AlertDialogAction
          onClick={onConfirm}
          className={variant === 'destructive'
            ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
          }
        >
          {confirmLabel}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default ConfirmDialog;
