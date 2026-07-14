"use client";
import { use } from "react";
import { useProblem } from "@/src/hooks/useProblem";
import PanelGroup from "../components/PanelGroup";
import { Skeleton } from "@/src/components/Ui/Skeleton";

export default function ProblemPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const { data: problem, isPending, error } = useProblem(id);

    if (isPending) {
        return (
            <div className="h-screen bg-base-100 flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                    <Skeleton className="w-64 h-8" />
                </div>
            </div>
        );
    }

    if (error || !problem) {
        return (
            <div className="h-screen bg-base-100 flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center space-y-2">
                        <h2 className="text-xl font-bold">مسئله یافت نشد</h2>
                        <p className="text-sm opacity-70">
                            مسئله مورد نظر وجود ندارد یا شما به آن دسترسی ندارید.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-base-100 flex flex-col">
            <div className="flex-1">
                <PanelGroup problem={problem} />
            </div>
        </div>
    );
}
