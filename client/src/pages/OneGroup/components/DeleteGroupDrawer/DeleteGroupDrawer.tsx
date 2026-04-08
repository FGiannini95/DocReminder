import { ConfirmDrawer } from "@/components/ConfirmDrawer/ConfirmDrawer";

interface DeleteGroupDrawerProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export const DeleteGroupDrawer = ({
  open,
  onClose,
  onConfirm,
  isLoading,
}: DeleteGroupDrawerProps) => {
  return (
    <ConfirmDrawer
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      isLoading={isLoading}
      title="¿Eliminar el grupo?"
      message="Se eliminará el grupo y todos los documentos de las personas a cargo. Los documentos personales de los miembros no se verán afectados."
      confirmLabel="Eliminar"
    />
  );
};
