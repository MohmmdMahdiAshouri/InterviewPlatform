"use client";
import { ThemeProvider } from "next-themes";
import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "@/src/components/Ui/Navbar";
import { NotificationProvider } from "../components/Ui/Notification";
import { AuthInitializer } from "../components/auth/AuthInitializer";

export function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: { retry: false, refetchOnWindowFocus: false },
                },
            }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem={false}
            >
                <div className="min-h-screen transition-colors duration-500">
                    <NotificationProvider>
                        <AuthInitializer>
                            <Navbar />
                            {children}
                        </AuthInitializer>
                    </NotificationProvider>
                </div>
            </ThemeProvider>
        </QueryClientProvider>
    );
}
