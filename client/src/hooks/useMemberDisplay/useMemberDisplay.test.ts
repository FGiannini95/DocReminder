import { renderHook } from "@testing-library/react";
import { useMemberDisplay } from "./useMemberDisplay";
import { GroupMember } from "@/types/group";

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ user: 1 }),
}));

const mockMembers: GroupMember[] = [
  { user_id: 2, displayName: "Mario", email: "mario@test.com", status: "active" },
  { user_id: 3, displayName: "Luigi", email: "luigi@test.com", status: "active" },
  { user_id: 1, displayName: "Admin", email: "admin@test.com", status: "active" },
];

describe("useMemberDisplay", () => {
  it("isAdmin is true when user matches adminId", () => {
    const { result } = renderHook(() => useMemberDisplay({ members: mockMembers, adminId: 1 }));

    expect(result.current.isAdmin).toBe(true);
  });

  it("isAdmin is false when user does not match adminId", () => {
    const { result } = renderHook(() => useMemberDisplay({ members: mockMembers, adminId: 99 }));

    expect(result.current.isAdmin).toBe(false);
  });

  it("sorts admin first in the list", () => {
    const { result } = renderHook(() => useMemberDisplay({ members: mockMembers, adminId: 2 }));

    expect(result.current.sortedMembers[0].user_id).toBe(2);
  });

  it("returns empty array when no members provided", () => {
    const { result } = renderHook(() => useMemberDisplay({ adminId: 1 }));

    expect(result.current.sortedMembers).toHaveLength(0);
  });
});
