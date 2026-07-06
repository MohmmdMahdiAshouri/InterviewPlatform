"use client";
import { ThemeProvider } from "next-themes";
import { ReactNode, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "@/src/components/Ui/Navbar";
import { useAuthStore } from "@/src/stores/auth.store";
import * as authService from "@/src/services/auth.service";
import { NotificationProvider } from "../components/Ui/Notification";

export function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: { retry: false, refetchOnWindowFocus: false },
                },
            }),
    );
    const accessToken = useAuthStore((s) => s.accessToken);
    const setAuth = useAuthStore((s) => s.setAuth);

    useEffect(() => {
        if (accessToken) return;

        (async () => {
            try {
                const { accessToken: token } =
                    await authService.verifyRefreshToken();
                const user = await authService.checkLogin();
                setAuth(token, user);
            } catch {
                // کاربر لاگین نیست، مشکلی نیست
            }
        })();
    }, [accessToken, setAuth]);

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem={false}
            >
                <div className="min-h-screen transition-colors duration-500">
                    <NotificationProvider>
                        <Navbar />
                        {children}
                    </NotificationProvider>
                </div>
            </ThemeProvider>
        </QueryClientProvider>
    );
}
