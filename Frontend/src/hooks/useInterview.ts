import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as interviewService from "@/src/services/interview.service";
import type {
    CreateInterviewPayload,
    JoinInterviewPayload,
    UpdateInterviewProblemsPayload,
    UpdateInterviewStatusPayload,
} from "@/src/types/interview.type";
import { useNotification } from "../components/Ui/Notification";
import { getErrorMessage } from "../libs/getErrorMessage";

export function useCreateInterview() {
    const { addNotification } = useNotification();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: interviewService.createInterview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["interviews", "mine"] });
            addNotification({
                title: "عملیات موفق",
                type: "success",
                message: "مصاحبه با موفقیت ایجاد شد",
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

export function useJoinInterview() {
    return useMutation({
        mutationFn: interviewService.joinInterview,
    });
}

export function useMyInterviews() {
    return useQuery({
        queryKey: ["interviews", "mine"],
        queryFn: interviewService.listMyInterviews,
    });
}

export function useInterviewById(id: string) {
    return useQuery({
        queryKey: ["interviews", id],
        queryFn: () => interviewService.getInterviewById(id),
        enabled: !!id,
        refetchInterval: 10000,
    });
}

export function useUpdateInterviewProblems() {
    const { addNotification } = useNotification();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string;
            payload: UpdateInterviewProblemsPayload;
        }) => interviewService.updateInterviewProblems(id, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["interviews", variables.id],
            });
            queryClient.invalidateQueries({ queryKey: ["interviews", "mine"] });
            addNotification({
                title: "عملیات موفق",
                type: "success",
                message: "مسائل مصاحبه به‌روزرسانی شد",
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

export function useUpdateInterviewStatus() {
    const { addNotification } = useNotification();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string;
            payload: UpdateInterviewStatusPayload;
        }) => interviewService.updateInterviewStatus(id, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["interviews", variables.id],
            });
            queryClient.invalidateQueries({ queryKey: ["interviews", "mine"] });
            addNotification({
                title: "عملیات موفق",
                type: "success",
                message: "وضعیت مصاحبه به‌روزرسانی شد",
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
