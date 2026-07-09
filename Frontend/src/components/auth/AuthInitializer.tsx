"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/src/stores/auth.store";
import * as authService from "@/src/services/auth.service";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
    const setAccessToken = useAuthStore((s) => s.setAccessToken);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        authService.verifyRefreshToken()
            .then((data) => setAccessToken(data.accessToken))
            .catch(() => {})
            .finally(() => setReady(true));
    }, [setAccessToken]);

    if (!ready) return null;
    return <>{children}</>;
}