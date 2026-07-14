"use client";
import { useState } from "react";
import Link from "next/link";
import { useMyProblems, useDeleteProblem } from "@/src/hooks/useProblem";
import Button from "@/src/components/Ui/Button";
import { SkeletonTextMulti } from "@/src/components/Ui/Skeleton";
import { Code2Icon, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import type { Problem, ProblemVisibility } from "@/src/types/problem.type";

const difficultyConfig = {
    EASY: { label: "آسان", className: "badge_esay" },
    MEDIUM: { label: "متوسط", className: "badge_mid" },
    HARD: { label: "سخت", className: "badge_hard" },
};

const visibilityConfig: Record<ProblemVisibility, { label: string; icon: typeof Eye; className: string }> = {
    PUBLIC: {
        label: "عمومی",
        icon: Eye,
        className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/50",
    },
    PRIVATE: {
        label: "خصوصی",
        icon: EyeOff,
        className: "bg-amber-500/10 text-amber-500 border-amber-500/50",
    },
};

function MyProblemsList() {
    const [visibilityFilter, setVisibilityFilter] = useState<ProblemVisibility | "all">("all");
    const { data: problems, isPending } = useMyProblems(
        visibilityFilter === "all" ? undefined : { visibility: visibilityFilter }
    );
    const deleteProblem = useDeleteProblem();

    const handleDelete = (problem: Problem) => {
        if (window.confirm(`آیا از حذف مسئله "${problem.title}" اطمینان دارید؟`)) {
            deleteProblem.mutate(problem.id);
        }
    };

    if (isPending) {
        return <SkeletonTextMulti lines={4} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text_gradient">مسائل من</h1>
                <Button href="/my-problems/new" size="md">
                    ساخت مسئله جدید
                </Button>
            </div>

            <div className="flex gap-2">
                {(["all", "PUBLIC", "PRIVATE"] as const).map((value) => (
                    <button
                        key={value}
                        onClick={() => setVisibilityFilter(value)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                            visibilityFilter === value
                                ? "bg-green-500/20 text-green-400 border border-green-500/50"
                                : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                        }`}
                    >
                        {value === "all" ? "همه" : value === "PUBLIC" ? "عمومی" : "خصوصی"}
                    </button>
                ))}
            </div>

            {!problems?.length ? (
                <p className="text-center text-sm opacity-70 py-8">
                    مسئله‌ای وجود ندارد.
                </p>
            ) : (
                <div className="flex flex-col gap-y-4">
                    {problems.map((problem) => {
                        const visibility = visibilityConfig[problem.visibility];
                        const VisIcon = visibility.icon;

                        return (
                            <div
                                key={problem.id}
                                className="border_gradient rounded-[22px] p-1!"
                            >
                                <div className="flex items-center justify-between gap-4 rounded-[18px] bg-card-bg text-card-text p-4">
                                    <div className="flex items-center gap-x-5">
                                        <Code2Icon className="size-8" />
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h2 className="text-xl font-bold text_gradient">
                                                    {problem.title}
                                                </h2>
                                                <span className={difficultyConfig[problem.difficulty].className}>
                                                    {difficultyConfig[problem.difficulty].label}
                                                </span>
                                                <span className={`inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-xs font-medium ${visibility.className}`}>
                                                    <VisIcon className="size-3" />
                                                    {visibility.label}
                                                </span>
                                            </div>
                                            <p className="text-sm font-light">
                                                دسته بندی: {problem.category}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/my-problems/${problem.id}/edit`}
                                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                        >
                                            <Edit className="size-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(problem)}
                                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                                            disabled={deleteProblem.isPending}
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                        <Link
                                            href={`/problem/${problem.id}`}
                                            className="flex items-center bg_gradient p-2 rounded-3xl text-sm"
                                        >
                                            <span className="font-medium">مشاهده</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default MyProblemsList;
