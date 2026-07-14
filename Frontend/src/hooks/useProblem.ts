import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as problemService from "@/src/services/problem.service";
import type {
    ListProblemsFilters,
    ListMyProblemsFilters,
    UpdateProblemPayload,
} from "@/src/types/problem.type";
import { useNotification } from "../components/Ui/Notification";
import { getErrorMessage } from "../libs/getErrorMessage";

export function useCreateProblem() {
    const { addNotification } = useNotification();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: problemService.createProblem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["problems"] });
            addNotification({
                title: "عملیات موفق",
                type: "success",
                message: "مسئله با موفقیت ایجاد شد",
            });
        },
        onError: (error) => {
            addNotification({
                title: "خطا",
                type: "error",
                message: getErrorMessage(error),
            });
        },
    });
}

export function usePublicProblems(filters?: ListProblemsFilters) {
    return useQuery({
        queryKey: ["problems", "public", filters ?? {}],
        queryFn: () => problemService.listPublicProblems(filters),
    });
}

export function useMyProblems(filters?: ListMyProblemsFilters) {
    return useQuery({
        queryKey: ["problems", "mine", filters ?? {}],
        queryFn: () => problemService.listMyProblems(filters),
    });
}

export function useProblem(id: string) {
    return useQuery({
        queryKey: ["problems", id],
        queryFn: () => problemService.getProblemById(id),
        enabled: !!id,
    });
}

export function useUpdateProblem() {
    const { addNotification } = useNotification();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateProblemPayload }) =>
            problemService.updateProblem(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["problems"] });
            addNotification({
                title: "عملیات موفق",
                type: "success",
                message: "مسئله با موفقیت ویرایش شد",
            });
        },
        onError: (error) => {
            addNotification({
                title: "خطا",
                type: "error",
                message: getErrorMessage(error),
            });
        },
    });
}

export function useDeleteProblem() {
    const { addNotification } = useNotification();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: problemService.deleteProblem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["problems"] });
            addNotification({
                title: "عملیات موفق",
                type: "success",
                message: "مسئله با موفقیت حذف شد",
            });
        },
        onError: (error) => {
            addNotification({
                title: "خطا",
                type: "error",
                message: getErrorMessage(error),
            });
        },
    });
}
