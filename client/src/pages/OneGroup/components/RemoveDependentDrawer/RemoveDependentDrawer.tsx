import { ConfirmDrawer } from "@/components/ConfirmDrawer/ConfirmDrawer";
import { GroupDependent } from "@/types/group";

interface RemoveDependentDrawerProps {
  open: boolean;
  onClose: () => void;
  dependentToRemove: GroupDependent | null;
  onConfirm: () => void;
  isLoading: boolean;
}

export const RemoveDependentDrawer = ({
  open,
  onClose,
  dependentToRemove,
  onConfirm,
  isLoading,
}: RemoveDependentDrawerProps) => {
  return (
    <ConfirmDrawer
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      isLoading={isLoading}
      title={`¿Eliminar a ${dependentToRemove?.name}?`}
      message="Se eliminará la persona a cargo y todos sus documentos."
      confirmLabel="Eliminar"
    />
  );
};
