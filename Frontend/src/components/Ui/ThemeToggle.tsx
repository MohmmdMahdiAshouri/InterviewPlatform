"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isLight = theme === "light";

    return (
        <label
            className={`relative inline-flex items-center cursor-pointer ${mounted ? "opacity-100" : "opacity-0"}`}
        >
            <input
                type="checkbox"
                className="sr-only peer"
                checked={isLight}
                onChange={() => setTheme(isLight ? "dark" : "light")}
            />

            <div
                className="
                    relative h-10 w-20 rounded-full
                    bg_gradient
                    transition-all duration-1000

                    after:content-['🌙']
                    after:absolute after:top-1 after:left-1
                    after:flex after:h-8 after:w-8 after:items-center after:justify-center
                    after:rounded-full
                    after:bg-black
                    after:text-lg
                    after:transition-all after:duration-500

                    peer-checked:after:translate-x-10
                    peer-checked:after:content-['☀️']
                    peer-checked:after:bg-white
                "
            />
        </label>
    );
}
