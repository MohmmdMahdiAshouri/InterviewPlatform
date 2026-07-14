import { api } from "@/src/libs/api";
import type { VideoTokenResponse } from "@/src/types/interview.type";

export async function getVideoToken(interviewId: string) {
    const response = await api.get<VideoTokenResponse>(
        `/interviews/${interviewId}/video-token`
    );
    return response.data;
}
