"use client";
import { usePublicProblems } from "@/src/hooks/useProblem";
import ProblemsHeader from "./components/problems-header";
import ProblemsList from "./components/Problems-list";
import ProblemsState from "./components/Problems-state";
import { SkeletonTextMulti } from "@/src/components/Ui/Skeleton";

function Problems() {
    const { data: problems, isPending } = usePublicProblems();
    console.log(problems);
    

    return (
        <div>
            <div className="max-w-6xl mx-auto py-12">
                <ProblemsHeader />

                <ProblemsState />

                {isPending ? (
                    <SkeletonTextMulti lines={4} />
                ) : problems && problems.length > 0 ? (
                    <ProblemsList problems={problems} />
                ) : (
                    <p className="text-center text-sm opacity-70 py-8">
                        مسئله‌ای یافت نشد
                    </p>
                )}
            </div>
        </div>
    );
}

export default Problems;
