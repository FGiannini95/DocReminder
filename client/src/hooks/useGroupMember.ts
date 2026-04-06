import { GroupMember } from "@/types/group";
import { useAuth } from "@/context/AuthContext";

interface UseGroupMemberProps {
  members: GroupMember[];
  adminId: number;
}

export const useGroupMember = ({ members, adminId }: UseGroupMemberProps) => {
  const { user } = useAuth();
  const isAdmin = user === adminId;

  const sortedMembers = [...(members ?? [])].sort((a, b) =>
    a.user_id === adminId ? -1 : b.user_id === adminId ? 1 : 0
  );

  const getMemberInfo = (member: GroupMember) => {
    const raw = member.displayName ?? member.email.split("@")[0];
    const name = raw.charAt(0).toUpperCase() + raw.slice(1);
    return { displayName: name, avatar: name.charAt(0) };
  };

  return {
    isAdmin,
    sortedMembers,
    getMemberInfo,
  };
};
