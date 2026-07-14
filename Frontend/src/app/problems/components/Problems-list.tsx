"use client";
import Link from "next/link";
import { ChevronLeftIcon, Code2Icon } from "lucide-react";
import type { Problem } from "@/src/types/problem.type";

const difficultyConfig = {
    EASY: { label: "آسان", className: "badge_esay" },
    MEDIUM: { label: "متوسط", className: "badge_mid" },
    HARD: { label: "سخت", className: "badge_hard" },
};

interface ProblemsListProps {
    problems: Problem[];
}

function ProblemsList({ problems }: ProblemsListProps) {
    return (
        <div className="flex flex-col gap-y-4!">
            {problems.map((problem) => (
                <Link key={problem.id} href={`/problem/${problem.id}`}>
                    <div className="border_gradient rounded-[22px] p-1! transition-transform duration-500 hover:-translate-y-2 hover:scale-105">
                        <div className="flex items-center justify-between gap-4 rounded-[18px] bg-card-bg text-card-text p-2">
                            <div className="flex items-center justify-between gap-x-5">
                                <Code2Icon className="size-8" />
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <h2 className="text-2xl font-bold text_gradient">
                                                    {problem.title}
                                                </h2>
                                                <span
                                                    className={difficultyConfig[problem.difficulty].className}
                                                >
                                                    {difficultyConfig[problem.difficulty].label}
                                                </span>
                                            </div>
                                            <p className="text-md font-light">
                                                {" "}
                                                دسته بندی: {problem.category}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="">
                                        توضیحات: {problem.description}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center bg_gradient p-2 rounded-3xl text-sm">
                                <span className="font-medium">حل کردن</span>
                                <ChevronLeftIcon className="size-5" />
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default ProblemsList;
