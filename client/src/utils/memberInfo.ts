import { GroupMember } from "@/types/group";

export const getMemberInfo = (member: GroupMember) => {
  const raw = member.displayName ?? member.email.split("@")[0];
  const name = raw.charAt(0).toUpperCase() + raw.slice(1);
  return { displayName: name, avatar: name.charAt(0) };
};
