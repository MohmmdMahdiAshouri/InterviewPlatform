"use client";
import { use } from "react";
import { useProblem, useUpdateProblem } from "@/src/hooks/useProblem";
import ProblemForm from "../../components/ProblemForm";
import { SkeletonTextMulti } from "@/src/components/Ui/Skeleton";
import type { CreateProblemPayload } from "@/src/types/problem.type";

export default function EditProblemPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const { data: problem, isPending, error } = useProblem(id);
    const updateProblem = useUpdateProblem();

    if (isPending) {
        return (
            <div className="mt-10 flex items-start justify-center px-4">
                <div className="w-full max-w-2xl form_card">
                    <SkeletonTextMulti lines={8} />
                </div>
            </div>
        );
    }

    if (error || !problem) {
        return (
            <div className="mt-10 flex items-center justify-center px-4">
                <div className="w-full max-w-md form_card text-center">
                    <p className="text-lg font-bold">مسئله یافت نشد</p>
                </div>
            </div>
        );
    }

    const handleSubmit = async (data: CreateProblemPayload) => {
        await updateProblem.mutateAsync({ id, payload: data });
    };

    return (
        <div className="mt-10 flex items-start justify-center px-4">
            <div className="w-full max-w-2xl form_card">
                <h1 className="text-2xl font-bold text_gradient mb-6">
                    ویرایش مسئله
                </h1>
                <ProblemForm
                    mode="edit"
                    initialData={problem}
                    onSubmit={handleSubmit}
                    isLoading={updateProblem.isPending}
                />
            </div>
        </div>
    );
}
