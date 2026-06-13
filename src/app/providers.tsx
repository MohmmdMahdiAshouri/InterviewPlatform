"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import Navbar from "@/src/components/Navbar";

export function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
        >
            <div className="min-h-screen transition-colors duration-500">
                <Navbar />
                {children}
            </div>
        </ThemeProvider>
    );
}
