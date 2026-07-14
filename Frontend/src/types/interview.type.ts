import type { ProblemDifficulty } from "./problem.type";

export type InterviewStatus = "SCHEDULED" | "ACTIVE" | "ENDED";

export interface InterviewProblemSummary {
    order: number;
    problem: {
        id: string;
        title: string;
        difficulty: ProblemDifficulty;
        category: string;
        description: string;
        starterCode: Record<string, string> | null;
        examples: unknown;
        constraints: unknown;
    };
}

export interface InterviewParticipantSummary {
    id: string;
    joinedAt: string;
    user: {
        id: string;
        fullName: string;
    };
}

export interface Interview {
    id: string;
    title: string;
    roomCode?: string;
    status: InterviewStatus;
    createdAt: string;
    updatedAt: string;
    host: {
        id: string;
        fullName: string;
    };
    problems: InterviewProblemSummary[];
    participants: InterviewParticipantSummary[];
}

export interface InterviewListItem {
    id: string;
    title: string;
    status: InterviewStatus;
    createdAt: string;
    host: {
        id: string;
        fullName: string;
    };
    problemsCount: number;
}

export interface CreateInterviewPayload {
    title: string;
    problemIds: string[];
}

export interface JoinInterviewPayload {
    roomCode: string;
}

export interface UpdateInterviewProblemsPayload {
    problemIds: string[];
}

export interface UpdateInterviewStatusPayload {
    status: InterviewStatus;
}

export interface VideoTokenResponse {
    apiKey: string;
    token: string;
    callId: string;
    userId: string;
}

export interface ChatMessage {
    id: string;
    interviewId: string;
    senderId: string;
    content: string;
    createdAt: string;
    sender: {
        fullName: string;
    };
}
