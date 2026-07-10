"use client";
import { useState } from "react";
import { useCheckLogin } from "@/src/hooks/useAuth";
import {
    useRoleRequests,
    useApproveRoleRequest,
    useRejectRoleRequest,
} from "@/src/hooks/useRoleRequest";
import Button from "@/src/components/Ui/Button";
import { SkeletonTextMulti } from "@/src/components/Ui/Skeleton";
import { Clock, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import type { RoleRequestStatus } from "@/src/types/role-request.type";

const statusTabs: { label: string; value: RoleRequestStatus | "all" }[] = [
    { label: "در انتظار بررسی", value: "PENDING" },
    { label: "تایید شده", value: "APPROVED" },
    { label: "رد شده", value: "REJECTED" },
    { label: "همه", value: "all" },
];

const statusConfig = {
    PENDING: {
        label: "در انتظار بررسی",
        icon: Clock,
        className: "bg-amber-500/10 text-amber-500 border-amber-500/50",
    },
    APPROVED: {
        label: "تایید شده",
        icon: CheckCircle2,
        className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/50",
    },
    REJECTED: {
        label: "رد شده",
        icon: XCircle,
        className: "bg-red-500/10 text-red-500 border-red-500/50",
    },
};

function RoleRequestsAdminPanel() {
    const { data: user, isPending: userPending } = useCheckLogin();
    const [activeTab, setActiveTab] = useState<RoleRequestStatus | "all">("all");
    const { data: requests, isPending: requestsPending } = useRoleRequests(activeTab === "all" ? undefined : activeTab);
    const approveRequest = useApproveRoleRequest();
    const rejectRequest = useRejectRoleRequest();

    const handleApprove = (id: string) => {
        approveRequest.mutate(id);
    };

    const handleReject = (id: string) => {
        rejectRequest.mutate(id);
    };

    if (userPending) {
        return (
            <div className="form_card">
                <SkeletonTextMulti lines={4} />
            </div>
        );
    }

    if (!user || user.role !== "ADMIN") {
        return (
            <div className="form_card text-center space-y-4">
                <div className="flex justify-center">
                    <div className="bg_gradient flex size-16 items-center justify-center rounded-full">
                        <ShieldCheck className="size-8 text-white" />
                    </div>
                </div>
                <h2 className="text-xl font-bold">دسترسی غیرمجاز</h2>
                <p className="text-sm opacity-70">
                    شما اجازه دسترسی به این بخش را ندارید.
                </p>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("fa-IR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="space-y-6">
            <div className="form_card">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg_gradient flex size-10 items-center justify-center rounded-xl">
                        <ShieldCheck className="size-5 text-white" />
                    </div>
                    <h1 className="text-xl font-bold">مدیریت درخواست‌ها</h1>
                </div>

                <div className="flex gap-2 mb-6">
                    {statusTabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setActiveTab(tab.value)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                                activeTab === tab.value
                                    ? "bg-green-500/20 text-green-400 border border-green-500/50"
                                    : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {requestsPending ? (
                    <SkeletonTextMulti lines={3} />
                ) : !requests?.length ? (
                    <p className="text-center text-sm opacity-70 py-8">
                        درخواستی وجود ندارد.
                    </p>
                ) : (
                    <div className="space-y-4">
                        {requests.map((request) => (
                            <div
                                key={request.id}
                                className="bg-white/5 rounded-xl p-4 border border-white/10"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <p className="font-bold">
                                            {request.user.fullName}
                                        </p>
                                        <p className="text-sm opacity-70">
                                            {request.user.phone}
                                        </p>
                                        <p className="text-xs opacity-50">
                                            نقش فعلی: {request.user.role}
                                        </p>
                                        <p className="text-xs opacity-50">
                                            {formatDate(request.createdAt)}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-medium ${statusConfig[request.status].className}`}
                                        >
                                            {(() => {
                                                const Icon =
                                                    statusConfig[request.status]
                                                        .icon;
                                                return (
                                                    <Icon className="size-3" />
                                                );
                                            })()}
                                            {statusConfig[request.status].label}
                                        </div>

                                        {request.status === "PENDING" && (
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    loading={approveRequest.isPending}
                                                    onClick={() =>handleApprove(request.id)}
                                                    >
                                                    تایید
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    loading={
                                                        rejectRequest.isPending
                                                    }
                                                    onClick={() =>handleReject(request.id)}
                                                    >
                                                    رد
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default RoleRequestsAdminPanel;
