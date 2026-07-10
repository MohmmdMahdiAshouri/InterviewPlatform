"use client";
import { useCheckLogin } from "@/src/hooks/useAuth";
import {
    useMyRoleRequest,
    useCreateRoleRequest,
} from "@/src/hooks/useRoleRequest";
import Button from "@/src/components/Ui/Button";
import { SkeletonTextMulti } from "@/src/components/Ui/Skeleton";
import { Clock, CheckCircle2, XCircle, UserPlus } from "lucide-react";

function RoleRequestView() {
    const { data: user, isPending: userPending } = useCheckLogin();
    const { data: request, isPending: requestsPending } = useMyRoleRequest();
    const { mutate, isPending: createRequestPending } = useCreateRoleRequest();

    if (userPending || requestsPending) {
        return (
            <div className="form_card">
                <SkeletonTextMulti lines={4} />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    if (user.role === "INTERVIEWER") {
        return (
            <div className="form_card text-center space-y-4">
                <div className="flex justify-center">
                    <div className="bg_gradient flex size-16 items-center justify-center rounded-full">
                        <CheckCircle2 className="size-8 text-white" />
                    </div>
                </div>
                <h2 className="text-xl font-bold">
                    شما در حال حاضر دسترسی مصاحبه‌کننده دارید
                </h2>
                <p className="text-sm opacity-70">
                    می‌توانید سوالات ایجاد کنید و اتاق مصاحبه برگزار کنید.
                </p>
            </div>
        );
    }

    if (user.role === "ADMIN") {
        return (
            <div className="form_card text-center space-y-4">
                <div className="flex justify-center">
                    <div className="bg_gradient flex size-16 items-center justify-center rounded-full">
                        <CheckCircle2 className="size-8 text-white" />
                    </div>
                </div>
                <h2 className="text-xl font-bold">شما ادمین سیستم هستید</h2>
                <p className="text-sm opacity-70">
                    شما به تمام بخش‌های سیستم دسترسی دارید.
                </p>
            </div>
        );
    }

    const statusConfig = {
        PENDING: {
            label: "در انتظار بررسی",
            icon: Clock,
            className: "bg-amber-500/10 text-amber-500 border-amber-500/50",
        },
        APPROVED: {
            label: "تایید شده",
            icon: CheckCircle2,
            className:
                "bg-emerald-500/10 text-emerald-500 border-emerald-500/50",
        },
        REJECTED: {
            label: "رد شده",
            icon: XCircle,
            className: "bg-red-500/10 text-red-500 border-red-500/50",
        },
    };

    const isPending = request?.status === "PENDING";

    return (
        <div className="form_card space-y-6">
            <div className="text-center space-y-2">
                <div className="flex justify-center">
                    <div className="bg_gradient flex size-16 items-center justify-center rounded-full">
                        <UserPlus className="size-8 text-white" />
                    </div>
                </div>
                <h2 className="text-xl font-bold">
                    درخواست دسترسی مصاحبه‌کننده
                </h2>
                <p className="text-sm opacity-70">
                    با دریافت این دسترسی می‌توانید سوالات ایجاد کنید و اتاق
                    مصاحبه برگزار کنید.
                </p>
            </div>

            {request && (
                <div className="flex justify-center items-center gap-x-1">
                    آخرین درخواست شما:
                    <div
                        className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium ${statusConfig[request.status].className}`}
                    >
                        {(() => {
                            const Icon = statusConfig[request.status].icon;
                            return <Icon className="size-4" />;
                        })()}
                        {statusConfig[request.status].label}
                    </div>
                </div>
            )}

            <Button
                loading={createRequestPending}
                disabled={isPending || request?.status === "APPROVED"}
                className="w-full"
                size="md"
                onClick={() => mutate()}
            >
                {isPending ? "در انتظار بررسی" : "ارسال درخواست"}
            </Button>
        </div>
    );
}
export default RoleRequestView;