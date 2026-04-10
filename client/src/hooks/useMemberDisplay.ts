import { GroupMember } from "@/types/group";
import { useAuth } from "@/context/AuthContext";
import { getMemberInfo } from "@/utils/memberInfo";

export const useMemberDisplay = ({
  members = [],
  adminId,
}: {
  members?: GroupMember[];
  adminId: number;
}) => {
  const { user } = useAuth();
  const isAdmin = user === adminId;

  const sortedMembers = [...(members ?? [])].sort((a, b) =>
    a.user_id === adminId ? -1 : b.user_id === adminId ? 1 : 0
  );

  return {
    isAdmin,
    sortedMembers,
    getMemberInfo,
  };
};
