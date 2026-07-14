import { api } from "@/src/libs/api";
import type {
    Interview,
    InterviewListItem,
    CreateInterviewPayload,
    JoinInterviewPayload,
    UpdateInterviewProblemsPayload,
    UpdateInterviewStatusPayload,
} from "@/src/types/interview.type";

export async function createInterview(payload: CreateInterviewPayload) {
    const response = await api.post<Interview>("/interviews", payload);
    return response.data;
}

export async function joinInterview(payload: JoinInterviewPayload) {
    const response = await api.post<{ id: string }>("/interviews/join", payload);
    return response.data;
}

export async function listMyInterviews() {
    const response = await api.get<InterviewListItem[]>("/interviews/mine");
    return response.data;
}

export async function getInterviewById(id: string) {
    const response = await api.get<Interview>(`/interviews/${id}`);
    return response.data;
}

export async function updateInterviewProblems(
    id: string,
    payload: UpdateInterviewProblemsPayload
) {
    const response = await api.patch<{ message: string }>(
        `/interviews/${id}/problems`,
        payload
    );
    return response.data;
}

export async function updateInterviewStatus(
    id: string,
    payload: UpdateInterviewStatusPayload
) {
    const response = await api.patch<Interview>(
        `/interviews/${id}/status`,
        payload
    );
    return response.data;
}
