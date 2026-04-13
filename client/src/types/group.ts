import { DocumentType } from "./document";

export interface Group {
  private_groups_id: number;
  name: string;
  icon: string | null;
  member_count: number;
  dependent_count: number;
}

export interface GroupMember {
  user_id: number;
  displayName: string;
  email: string;
  status: "pending" | "active";
}

export interface GroupDependent {
  group_dependents_id?: number;
  name: string;
  relationship: string | null;
  avatar: string | null;
}

export interface GroupDocument {
  documentId: number;
  type: DocumentType;
  name: string;
  expiryDate: string;
  user_id: number | null;
  dependent_id: number | null;
  ownerName?: string;
}

export interface GroupDetail {
  group: {
    private_groups_id: number;
    name: string;
    icon: string | null;
    admin_id: number;
  };
  members: GroupMember[];
  dependents: GroupDependent[];
  documents: GroupDocument[];
}
