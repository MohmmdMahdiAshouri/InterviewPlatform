"use client";
import { useCheckLogin } from "@/src/hooks/useAuth";
import MyProblemsList from "./components/MyProblemsList";
import { SkeletonTextMulti } from "@/src/components/Ui/Skeleton";
import Button from "@/src/components/Ui/Button";
import { UserPlus } from "lucide-react";

export default function MyProblemsPage() {
    const { data: user, isPending } = useCheckLogin();

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

    if (user.role === "USER") {
        return (
            <div className="mt-10 flex items-center justify-center px-4">
                <div className="w-full max-w-md form_card text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="bg_gradient flex size-16 items-center justify-center rounded-full">
                            <UserPlus className="size-8 text-white" />
                        </div>
                    </div>
                    <h2 className="text-xl font-bold">
                        دسترسی لازم را ندارید
                    </h2>
                    <p className="text-sm opacity-70">
                        برای ایجاد مسئله، ابتدا باید درخواست دسترسی مصاحبه‌کننده دهید.
                    </p>
                    <Button href="/role-request" size="md" className="w-full">
                        درخواست دسترسی
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-10 flex items-start justify-center px-4">
            <div className="w-full max-w-4xl form_card">
                <MyProblemsList />
            </div>
        </div>
    );
}
