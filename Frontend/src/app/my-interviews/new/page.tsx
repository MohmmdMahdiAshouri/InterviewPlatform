"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCreateInterview } from "@/src/hooks/useInterview";
import { useMyProblems, usePublicProblems } from "@/src/hooks/useProblem";
import Button from "@/src/components/Ui/Button";
import Input from "@/src/components/Ui/Input";
import { SkeletonTextMulti } from "@/src/components/Ui/Skeleton";
import { getErrorMessage } from "@/src/libs/getErrorMessage";
import { Copy, Check, Video, ArrowRight } from "lucide-react";

const difficultyConfig: Record<string, { label: string; className: string }> = {
    EASY: { label: "آسان", className: "badge_esay" },
    MEDIUM: { label: "متوسط", className: "badge_mid" },
    HARD: { label: "سخت", className: "badge_hard" },
};

export default function NewInterviewPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [selectedProblemIds, setSelectedProblemIds] = useState<string[]>([]);
    const [serverError, setServerError] = useState("");
    const [createdRoomCode, setCreatedRoomCode] = useState<string | null>(null);
    const [createdInterviewId, setCreatedInterviewId] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const { data: myProblems, isPending: loadingMy } = useMyProblems();
    const { data: publicProblems, isPending: loadingPublic } = usePublicProblems();
    const createInterview = useCreateInterview();

    // Merge and dedupe problems by id
    const allProblems = useMemo(() => {
        const map = new Map<string, (typeof myProblems extends Array<infer T> ? T : never)>();
        if (myProblems) {
            for (const p of myProblems) {
                map.set(p.id, p);
            }
        }
        if (publicProblems) {
            for (const p of publicProblems) {
                if (!map.has(p.id)) {
                    map.set(p.id, p);
                }
            }
        }
        return Array.from(map.values());
    }, [myProblems, publicProblems]);

    const isLoading = loadingMy || loadingPublic;

    const toggleProblem = (problemId: string) => {
        setSelectedProblemIds((prev) => {
            if (prev.includes(problemId)) {
                return prev.filter((id) => id !== problemId);
            }
            return [...prev, problemId];
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError("");

        if (!title.trim()) {
            setServerError("عنوان الزامی است");
            return;
        }

        if (selectedProblemIds.length === 0) {
            setServerError("حداقل یک مسئله انتخاب کنید");
            return;
        }

        try {
            const result = await createInterview.mutateAsync({
                title: title.trim(),
                problemIds: selectedProblemIds,
            });
            setCreatedRoomCode(result.roomCode || null);
            setCreatedInterviewId(result.id);
        } catch (error) {
            setServerError(getErrorMessage(error));
        }
    };

    const copyRoomCode = () => {
        if (createdRoomCode) {
            navigator.clipboard.writeText(createdRoomCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Success state: show room code
    if (createdRoomCode && createdInterviewId) {
        return (
            <div className="mt-10 flex items-start justify-center px-4">
                <div className="w-full max-w-md form_card text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="bg_gradient flex size-16 items-center justify-center rounded-full">
                            <Video className="size-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text_gradient">
                        مصاحبه ایجاد شد
                    </h1>
                    <p className="text-sm opacity-70">
                        کد اتاق را با شرکت‌کنندگان به اشتراک بگذارید.
                    </p>

                    {/* Room code display */}
                    <div className="border_gradient rounded-[22px] p-1!">
                        <div className="rounded-[18px] bg-card-bg p-4 flex items-center justify-between">
                            <span className="text-sm opacity-70">کد اتاق:</span>
                            <div className="flex items-center gap-2">
                                <span
                                    dir="ltr"
                                    className="text-2xl font-mono font-bold text_gradient"
                                >
                                    {createdRoomCode}
                                </span>
                                <button
                                    onClick={copyRoomCode}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                    title="کپی کد"
                                >
                                    {copied ? (
                                        <Check className="size-4 text-emerald-400" />
                                    ) : (
                                        <Copy className="size-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            onClick={() => router.push(`/interview/${createdInterviewId}`)}
                            className="flex-1"
                            icon={<ArrowRight className="size-5" />}
                        >
                            برو به اتاق
                        </Button>
                        <Button
                            onClick={() => router.push("/my-interviews")}
                            className="flex-1 bg-white/10 hover:bg-white/20"
                        >
                            بازگشت
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-10 flex items-start justify-center px-4">
            <div className="w-full max-w-2xl form_card">
                <h1 className="text-2xl font-bold text_gradient mb-6">
                    ساخت مصاحبه جدید
                </h1>

                {serverError && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title input */}
                    <Input
                        label="عنوان مصاحبه"
                        placeholder="مثلاً: مصاحبه فنی مرحله اول"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    {/* Problem selection */}
                    <div className="space-y-3">
                        <label className="block text-sm">
                            انتخاب مسائل
                            <span className="text-red-400 mr-1">*</span>
                        </label>

                        {isLoading ? (
                            <SkeletonTextMulti lines={3} />
                        ) : allProblems.length === 0 ? (
                            <p className="text-sm opacity-70 py-4 text-center">
                                مسئله‌ای موجود نیست. ابتدا مسئله بسازید.
                            </p>
                        ) : (
                            <div className="max-h-80 overflow-y-auto space-y-2 border border-white/10 rounded-xl p-3">
                                {allProblems.map((problem) => {
                                    const isSelected = selectedProblemIds.includes(
                                        problem.id
                                    );
                                    const difficulty =
                                        difficultyConfig[problem.difficulty];

                                    return (
                                        <label
                                            key={problem.id}
                                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                                                isSelected
                                                    ? "bg-green-500/10 border border-green-500/50"
                                                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() =>
                                                    toggleProblem(problem.id)
                                                }
                                                className="size-4 rounded accent-green-500"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium truncate">
                                                        {problem.title}
                                                    </span>
                                                    <span
                                                        className={difficulty?.className}
                                                    >
                                                        {difficulty?.label}
                                                    </span>
                                                </div>
                                                <p className="text-xs opacity-60 truncate">
                                                    {problem.category}
                                                </p>
                                            </div>
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-lg ${
                                                    problem.visibility === "PUBLIC"
                                                        ? "bg-emerald-500/10 text-emerald-400"
                                                        : "bg-amber-500/10 text-amber-400"
                                                }`}
                                            >
                                                {problem.visibility === "PUBLIC"
                                                    ? "عمومی"
                                                    : "خصوصی"}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        )}

                        {selectedProblemIds.length > 0 && (
                            <p className="text-xs opacity-60">
                                {selectedProblemIds.length} مسئله انتخاب شده (ترتیب
                                نمایش بر اساس ترتیب انتخاب است)
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            loading={createInterview.isPending}
                            className="flex-1"
                        >
                            ایجاد مصاحبه
                        </Button>
                        <Button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 bg-white/10 hover:bg-white/20"
                        >
                            انصراف
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
