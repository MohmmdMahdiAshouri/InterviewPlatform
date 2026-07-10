import {
    ArrowLeftIcon,
    SparklesIcon,
    LogOut,
    Settings,
    User,
    UserPlus,
    ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ThemeToggle } from "./ThemeToggle";
import Button from "./Button";
import Dropdown from "./Dropdown";
import Skeleton from "./Skeleton";

import { useAuthStore } from "@/src/stores/auth.store";
import { useCheckLogin, useLogout } from "@/src/hooks/useAuth";

function Navbar() {
    const router = useRouter();

    const accessToken = useAuthStore((s) => s.accessToken);

    const { data: user, isPending, isSuccess } = useCheckLogin();

    const logout = useLogout();

    return (
        <nav className="glass-navbar sticky top-0 z-50 backdrop-blur-3xl shadow-lg">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3">
                    <div className="bg_gradient flex size-10 items-center justify-center rounded-xl shadow-lg">
                        <SparklesIcon className="size-6 text-white" />
                    </div>

                    <span className="text-2xl font-bold tracking-wider">
                        پلتفرم مصاحبه آنلاین
                    </span>
                </Link>

                {/* Right Side */}
                <div className="flex items-center gap-3">
                    <ThemeToggle />

                    <div className="flex w-32 justify-end">
                        {!accessToken ? (
                            <Button
                                href="/auth/login"
                                size="md"
                                icon={<ArrowLeftIcon className="size-5" />}
                            >
                                شروع کردن
                            </Button>
                        ) : isPending ? (
                            <Skeleton className="size-10 rounded-xl" />
                        ) : isSuccess ? (
                            <Dropdown
                                trigger={
                                    <button
                                        className="
                                            glass-navbar
                                            active:scale-95
                                            flex
                                            size-10
                                            items-center
                                            justify-center

                                            rounded-full

                                            transition-all
                                            duration-300

                                            hover:scale-105
                                            hover:shadow-lg
                                        "
                                    >
                                        <User className="size-10 border-2 rounded-full p-1" />
                                    </button>
                                }
                                header={
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="
                                                bg_gradient
                                                flex
                                                size-10
                                                items-center
                                                justify-center

                                                rounded-full
                                            "
                                        >
                                            <User className="size-5" />
                                        </div>

                                        <div>
                                            <p className="font-bold">
                                                {user.fullName}
                                            </p>

                                            <p className="text-xs opacity-60">
                                                خوش آمدید
                                            </p>
                                        </div>
                                    </div>
                                }
                                items={[
                                    {
                                        label: "پروفایل",
                                        icon: <User className="size-4" />,
                                        onClick: () => router.push("/profile"),
                                    },
                                    {
                                        label: "تنظیمات",
                                        icon: <Settings className="size-4" />,
                                        onClick: () => router.push("/settings"),
                                    },
                                    ...(user.role === "USER"
                                        ? [{
                                                label: "درخواست مصاحبه‌کننده",
                                                icon: (
                                                    <UserPlus className="size-4" />
                                                ),
                                                onClick: () =>
                                                    router.push(
                                                        "/role-request",
                                                    ),
                                            }]
                                        : []),
                                    ...(user.role === "ADMIN"
                                        ? [{
                                                label: "مدیریت درخواست‌ها",
                                                icon: (
                                                    <ShieldCheck className="size-4" />
                                                ),
                                                onClick: () =>
                                                    router.push(
                                                        "/admin/role-requests",
                                                    ),
                                            }]
                                        : []),
                                    {
                                        divider: true,
                                        label: "خروج",
                                        danger: true,
                                        icon: <LogOut className="size-4" />,
                                        onClick: () => logout.mutate(),
                                    },
                                ]}
                            />
                        ) : (
                            <Button
                                href="/auth/login"
                                size="md"
                                icon={<ArrowLeftIcon className="size-5" />}
                            >
                                شروع کردن
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
