import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as roleRequestService from "@/src/services/role-request.service";
import type { RoleRequestStatus } from "@/src/types/role-request.type";
import { useNotification } from "../components/Ui/Notification";
import { getErrorMessage } from "../libs/getErrorMessage";

export function useCreateRoleRequest() {
    const { addNotification } = useNotification();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: roleRequestService.createRoleRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["role-requests", "me"],
            });
            addNotification({
                title: "عملیات موفق",
                type: "success",
                message: "درخواست شما ثبت شد",
            });
        },
        onError: (error) => {
            addNotification({
                title: "توجه!",
                type: "warning",
                message: getErrorMessage(error),
            });
        },
    });
}

export function useMyRoleRequest() {
    return useQuery({
        queryKey: ["role-requests", "me"],
        queryFn: roleRequestService.getMyRoleRequest,
    });
}

export function useRoleRequests(status?: RoleRequestStatus) {
    return useQuery({
        queryKey: ["role-requests", "list", status ?? "all"],
        queryFn: () => roleRequestService.listRoleRequests(status),
    });
}

export function useApproveRoleRequest() {
    const { addNotification } = useNotification();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: roleRequestService.approveRoleRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["role-requests"] });
            addNotification({
                type: "success",
                title: "درخواست تایید شد",
            });
        },
        onError: (error) => {
            addNotification({
                type: "error",
                title: "خطا",
                message: getErrorMessage(error),
            });
        },
    });
}

export function useRejectRoleRequest() {
    const { addNotification } = useNotification();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: roleRequestService.rejectRoleRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["role-requests"] });
            addNotification({
                type: "success",
                title: "درخواست رد شد",
            });
        },
        onError: (error) => {
            addNotification({
                type: "error",
                title: "خطا",
                message: getErrorMessage(error),
            });
        },
    });
}
