"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
        >
            <div className="min-h-screen transition-colors duration-1000">
                {children}
            </div>
        </ThemeProvider>
    );
}
