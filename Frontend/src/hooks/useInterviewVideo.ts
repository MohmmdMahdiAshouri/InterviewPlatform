import { useQuery } from "@tanstack/react-query";
import * as interviewVideoService from "@/src/services/interview-video.service";

export function useVideoToken(interviewId: string) {
    return useQuery({
        queryKey: ["interviews", interviewId, "video-token"],
        queryFn: () => interviewVideoService.getVideoToken(interviewId),
        enabled: !!interviewId,
        // Don't refetch on window focus — a token refetch mid-call could be disruptive
        refetchOnWindowFocus: false,
        // Tokens are valid for 24h, no need to refetch frequently
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}
