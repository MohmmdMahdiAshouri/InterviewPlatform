"use client";
import { use } from "react";
import { useInterviewById } from "@/src/hooks/useInterview";
import { useCheckLogin } from "@/src/hooks/useAuth";
import Interview from "../components/Interview";
import { Skeleton } from "@/src/components/Ui/Skeleton";

export default function InterviewPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const { data: interview, isPending, error } = useInterviewById(id);
    const { data: user } = useCheckLogin();

    if (isPending) {
        return (
            <div className="h-screen bg-base-100 flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <Skeleton className="w-64 h-8 mx-auto" />
                        <Skeleton className="w-48 h-4 mx-auto" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !interview) {
        const is403 =
            error &&
            "response" in error &&
            (error as { response?: { status?: number } }).response?.status === 403;

        return (
            <div className="h-screen bg-base-100 flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center space-y-2">
                        <h2 className="text-xl font-bold">
                            {is403
                                ? "شما به این مصاحبه دسترسی ندارید"
                                : "مصاحبه یافت نشد"}
                        </h2>
                        <p className="text-sm opacity-70">
                            {is403
                                ? "برای شرکت در این مصاحبه، ابتدا باید با کد اتاق وارد شوید."
                                : "مصاحبه مورد نظر وجود ندارد یا حذف شده است."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="h-screen bg-base-100 flex flex-col">
            <div className="flex-1">
                <Interview interview={interview} currentUser={user} />
            </div>
        </div>
    );
}
