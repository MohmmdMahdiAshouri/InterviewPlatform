import { api } from "@/src/libs/api";
import type {
    Problem,
    CreateProblemPayload,
    UpdateProblemPayload,
    ListProblemsFilters,
    ListMyProblemsFilters,
} from "@/src/types/problem.type";

export async function createProblem(payload: CreateProblemPayload) {
    const response = await api.post<Problem>("/problems", payload);
    return response.data;
}

export async function listPublicProblems(filters?: ListProblemsFilters) {
    const response = await api.get<Problem[]>("/problems/public", {
        params: filters,
    });
    return response.data;
}

export async function listMyProblems(filters?: ListMyProblemsFilters) {
    const response = await api.get<Problem[]>("/problems/mine", {
        params: filters,
    });
    return response.data;
}

export async function getProblemById(id: string) {
    const response = await api.get<Problem>(`/problems/${id}`);
    return response.data;
}

export async function updateProblem(id: string, payload: UpdateProblemPayload) {
    const response = await api.patch<Problem>(`/problems/${id}`, payload);
    return response.data;
}

export async function deleteProblem(id: string) {
    const response = await api.delete<{ message: string }>(`/problems/${id}`);
    return response.data;
}
