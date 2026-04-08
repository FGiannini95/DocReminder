export interface Group {
  private_groups_id: number;
  name: string;
  icon: string | null;
  member_count: number;
}

export interface GroupMember {
  user_id: number;
  displayName: string;
  email: string;
  status: "pending" | "active";
}

export interface GroupDependent {
  group_dependents_id: number;
  name: string;
  relationship: string | null;
  birth_date: string | null;
}

export interface GroupDocument {
  documentId: number;
  type: string;
  name: string;
  expiryDate: string;
  user_id: number | null;
  dependent_id: number | null;
}

export interface GroupDetail {
  group: {
    private_groups_id: number;
    name: string;
    icon: string | null;
    admin_id: number;
  };
  members: GroupMember[];
  dependants: GroupDependent[];
  documents: GroupDocument[];
}
