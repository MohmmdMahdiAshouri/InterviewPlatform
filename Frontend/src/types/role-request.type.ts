import type { Role } from "./auth.type";

export type RoleRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface RoleRequest {
    id: string;
    userId: string;
    status: RoleRequestStatus;
    reviewedBy: string | null;
    createdAt: string;
    reviewedAt: string | null;
}

export interface RoleRequestWithUser extends RoleRequest {
    user: {
        id: string;
        fullName: string;
        phone: string;
        role: Role;
    };
}
