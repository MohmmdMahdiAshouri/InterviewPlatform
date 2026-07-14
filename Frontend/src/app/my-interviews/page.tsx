"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCheckLogin } from "@/src/hooks/useAuth";
import { useMyInterviews, useJoinInterview } from "@/src/hooks/useInterview";
import Button from "@/src/components/Ui/Button";
import Input from "@/src/components/Ui/Input";
import { SkeletonTextMulti } from "@/src/components/Ui/Skeleton";
import { getErrorMessage } from "@/src/libs/getErrorMessage";
import { UserPlus, Video, Copy, Check, LogIn } from "lucide-react";

const statusConfig: Record<
    string,
    { label: string; className: string }
> = {
    SCHEDULED: {
        label: "برنامه‌ریزی شده",
        className: "bg-blue-500/10 text-blue-400 border border-blue-500/50",
    },
    ACTIVE: {
        label: "فعال",
        className: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/50",
    },
    ENDED: {
        label: "پایان یافته",
        className: "bg-gray-500/10 text-gray-400 border border-gray-500/50",
    },
};

export default function MyInterviewsPage() {
    const router = useRouter();
    const { data: user, isPending } = useCheckLogin();

    // Join by code state
    const [joinCode, setJoinCode] = useState("");
    const [joinError, setJoinError] = useState("");
    const joinInterview = useJoinInterview();

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        setJoinError("");

        if (!joinCode.trim()) {
            setJoinError("کد اتاق را وارد کنید");
            return;
        }

        try {
            const result = await joinInterview.mutateAsync({
                roomCode: joinCode.trim(),
            });
            router.push(`/interview/${result.id}`);
        } catch (error) {
            setJoinError(getErrorMessage(error));
        }
    };

    if (isPending) {
        return (
            <div className="mt-10 flex items-start justify-center px-4">
                <div className="w-full max-w-4xl">
                    <SkeletonTextMulti lines={4} />
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    // USER role: show only the join-by-code section + interviewer request CTA
    if (user.role === "USER") {
        return (
            <div className="mt-10 flex items-center justify-center px-4">
                <div className="w-full max-w-md space-y-6">
                    {/* Join by code card */}
                    <div className="form_card">
                        <h2 className="text-xl font-bold text_gradient mb-4">
                            ورود به مصاحبه
                        </h2>
                        <p className="text-sm opacity-70 mb-4">
                            کد اتاق مصاحبه را از مصاحبه‌کننده دریافت کنید و در اینجا وارد کنید.
                        </p>
                        <form onSubmit={handleJoin} className="space-y-4">
                            <Input
                                label="کد اتاق"
                                placeholder="مثلاً: ABC123"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value)}
                                error={joinError}
                                dir="ltr"
                            />
                            <Button
                                type="submit"
                                loading={joinInterview.isPending}
                                className="w-full"
                                icon={<LogIn className="size-5" />}
                            >
                                ورود به مصاحبه
                            </Button>
                        </form>
                    </div>

                    {/* Interviewer request CTA */}
                    <div className="form_card text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="bg_gradient flex size-16 items-center justify-center rounded-full">
                                <UserPlus className="size-8 text-white" />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold">
                            دسترسی لازم را ندارید
                        </h2>
                        <p className="text-sm opacity-70">
                            برای ایجاد مصاحبه، ابتدا باید درخواست دسترسی مصاحبه‌کننده دهید.
                        </p>
                        <Button href="/role-request" size="md" className="w-full">
                            درخواست دسترسی
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-10 flex items-start justify-center px-4">
            <div className="w-full max-w-4xl form_card">
                <MyInterviewsList user={user} />
            </div>
        </div>
    );
}

function MyInterviewsList({
    user,
}: {
    user: { id: string; role: string };
}) {
    const router = useRouter();
    const { data: interviews, isPending } = useMyInterviews();
    const [joinCode, setJoinCode] = useState("");
    const [joinError, setJoinError] = useState("");
    const joinInterview = useJoinInterview();
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        setJoinError("");

        if (!joinCode.trim()) {
            setJoinError("کد اتاق را وارد کنید");
            return;
        }

        try {
            const result = await joinInterview.mutateAsync({
                roomCode: joinCode.trim(),
            });
            router.push(`/interview/${result.id}`);
        } catch (error) {
            setJoinError(getErrorMessage(error));
        }
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (isPending) {
        return <SkeletonTextMulti lines={4} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text_gradient">
                    مصاحبه‌های من
                </h1>
                <Button href="/my-interviews/new" size="md">
                    ساخت مصاحبه جدید
                </Button>
            </div>

            {/* Join by code section */}
            <div className="border_gradient rounded-[22px] p-1!">
                <div className="rounded-[18px] bg-card-bg text-card-text p-4">
                    <h3 className="font-bold mb-3">ورود با کد اتاق</h3>
                    <form onSubmit={handleJoin} className="flex gap-3">
                        <Input
                            placeholder="کد اتاق را وارد کنید"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value)}
                            error={joinError}
                            dir="ltr"
                            className="flex-1"
                        />
                        <Button
                            type="submit"
                            loading={joinInterview.isPending}
                            size="md"
                            icon={<LogIn className="size-4" />}
                        >
                            ورود
                        </Button>
                    </form>
                </div>
            </div>

            {!interviews?.length ? (
                <p className="text-center text-sm opacity-70 py-8">
                    مصاحبه‌ای وجود ندارد.
                </p>
            ) : (
                <div className="flex flex-col gap-y-4">
                    {interviews.map((interview) => {
                        const status = statusConfig[interview.status];

                        return (
                            <div
                                key={interview.id}
                                className="border_gradient rounded-[22px] p-1!"
                            >
                                <div className="flex items-center justify-between gap-4 rounded-[18px] bg-card-bg text-card-text p-4">
                                    <div className="flex items-center gap-x-5">
                                        <Video className="size-8" />
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h2 className="text-xl font-bold text_gradient">
                                                    {interview.title}
                                                </h2>
                                                <span
                                                    className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-medium ${status.className}`}
                                                >
                                                    {status.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm font-light">
                                                <span>
                                                    میزبان: {interview.host.fullName}
                                                </span>
                                                <span>
                                                    {interview.problemsCount} مسئله
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            onClick={() =>
                                                router.push(`/interview/${interview.id}`)
                                            }
                                            size="sm"
                                        >
                                            ورود
                                        </Button>
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
