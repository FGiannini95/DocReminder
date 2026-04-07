import { GroupMember } from "@/types/group";
import { getMemberInfo } from "@/utils/memberInfo";
import { ConfirmDrawer } from "@/components/ConfirmDrawer/ConfirmDrawer";

interface RemoveMemberDrawerProps {
  open: boolean;
  onClose: () => void;
  member: GroupMember | null;
  onConfirm: () => void;
  isLoading: boolean;
}

export const RemoveMemberDrawer = ({
  open,
  onClose,
  member,
  onConfirm,
  isLoading,
}: RemoveMemberDrawerProps) => {
  if (!member) return null;
  const { displayName } = getMemberInfo(member!);

  return (
    <ConfirmDrawer
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      isLoading={isLoading}
      title={`¿Eliminar a ${displayName}?`}
      message="El miembro perderá el acceso al grupo y sus documentos dejarán de aparecer aquí."
      confirmLabel="Eliminar"
    />
  );
};
