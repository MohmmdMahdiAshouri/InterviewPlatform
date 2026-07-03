"use client";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/stores/auth.store";
import * as authService from "@/src/services/auth.service";

export function RouteGuard({ children }: { children: ReactNode }) {
    const router = useRouter();
    const accessToken = useAuthStore((s) => s.accessToken);
    const setAuth = useAuthStore((s) => s.setAuth);

    const [status, setStatus] = useState<
        "checking" | "authorized" | "unauthorized"
    >(() => (accessToken ? "authorized" : "checking"));

    useEffect(() => {
        if (accessToken) return;

        (async () => {
            try {
                const { accessToken: token } =
                    await authService.verifyRefreshToken();
                const user = await authService.checkLogin();
                setAuth(token, user);
                setStatus("authorized");
            } catch {
                setStatus("unauthorized");
                router.replace("/auth/login");
            }
        })();
    }, [accessToken, setAuth, router]);

    if (status === "checking") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="size-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (status === "unauthorized") {
        return null;
    }

    return <>{children}</>;
}
