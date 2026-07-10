import { api } from "@/src/libs/api";
import type {
    RoleRequest,
    RoleRequestStatus,
    RoleRequestWithUser,
} from "@/src/types/role-request.type";

export async function createRoleRequest() {
    const response = await api.post<RoleRequest>("/role-requests");
    return response.data;
}

export async function getMyRoleRequest() {
    const response = await api.get<RoleRequest>("/role-requests/me");
    return response.data;
}

export async function listRoleRequests(status?: RoleRequestStatus) {
    const response = await api.get<RoleRequestWithUser[]>("/role-requests", {
        params: status ? { status } : {},
    });
    return response.data;
}

export async function approveRoleRequest(id: string) {
    const response = await api.patch<RoleRequest>(
        `/role-requests/${id}/approve`
    );
    return response.data;
}

export async function rejectRoleRequest(id: string) {
    const response = await api.patch<RoleRequest>(
        `/role-requests/${id}/reject`
    );
    return response.data;
}
