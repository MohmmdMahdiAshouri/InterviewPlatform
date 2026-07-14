"use client";
import { useCreateProblem } from "@/src/hooks/useProblem";
import ProblemForm from "../components/ProblemForm";
import type { CreateProblemPayload } from "@/src/types/problem.type";

export default function NewProblemPage() {
    const createProblem = useCreateProblem();

    const handleSubmit = async (data: CreateProblemPayload) => {
        await createProblem.mutateAsync(data);
    };

    return (
        <div className="mt-10 flex items-start justify-center px-4">
            <div className="w-full max-w-2xl form_card">
                <h1 className="text-2xl font-bold text_gradient mb-6">
                    ساخت مسئله جدید
                </h1>
                <ProblemForm
                    mode="create"
                    onSubmit={handleSubmit}
                    isLoading={createProblem.isPending}
                />
            </div>
        </div>
    );
}