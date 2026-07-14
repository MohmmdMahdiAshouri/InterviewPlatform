export type ProblemVisibility = "PRIVATE" | "PUBLIC";
export type ProblemDifficulty = "EASY" | "MEDIUM" | "HARD";

export interface ProblemExample {
    input: string;
    output: string;
    explanation?: string;
}

export interface Problem {
    id: string;
    ownerId: string;
    title: string;
    description: string;
    category: string;
    difficulty: ProblemDifficulty;
    visibility: ProblemVisibility;
    starterCode: Record<string, string> | null;
    examples: ProblemExample[] | null;
    constraints: string[] | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProblemPayload {
    title: string;
    description: string;
    category: string;
    difficulty: ProblemDifficulty;
    visibility?: ProblemVisibility;
    starterCode?: Record<string, string>;
    examples?: ProblemExample[];
    constraints?: string[];
}

export type UpdateProblemPayload = {
    title?: string;
    description?: string;
    category?: string;
    difficulty?: ProblemDifficulty;
    visibility?: ProblemVisibility;
    starterCode?: Record<string, string>;
    examples?: ProblemExample[];
    constraints?: string[];
};

export interface ListProblemsFilters {
    category?: string;
    difficulty?: ProblemDifficulty;
    search?: string;
}

export interface ListMyProblemsFilters extends ListProblemsFilters {
    visibility?: ProblemVisibility;
}
