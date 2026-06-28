"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import Image from "next/image";

interface Option {
    label: string;
    value: string;
    icon?: string;
}

interface GapSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    width?: number | string;
}

export default function GapSelect({
    options,
    value,
    onChange,
    placeholder = "انتخاب کنید",
    width,
}: GapSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((option) => option.value === value);

    //closed with click around
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div style={{ width }} className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center justify-between w-full px-3 py-2 
                    bg-[#1e1e2e] text-white border border-white rounded-lg
                    text-sm font-bold transition-all duration-300
                    ${isOpen ? "ring-2" : ""}
                    `}
            >
                <div className="flex items-center justify-between w-full truncate">
                    <span className="truncate">
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown
                        className={`size-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                </div>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        style={{overflow: "hidden"}}
                        className="absolute z-50 w-full mt-2 py-1 divide-y-2
                                    glass-navba backdrop-blur-md border border-white/10 dark:bg-black/40 text-white
                                    rounded-xl shadow-2xl"
                    >
                        {options.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`
                                    flex items-center justify-between px-3 py-2 mx-1 rounded-lg
                                    cursor-pointer text-sm font-bold hover:bg-white/10`}
                            >
                                <div className="flex items-center gap-2">
                                    {option.icon && (
                                        <Image
                                            src={option.icon}
                                            alt=""
                                            width={15}
                                            height={15}
                                        />
                                    )}
                                    {option.label}
                                </div>

                                {value === option.value && (
                                    <Check className="size-4" />
                                )}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
