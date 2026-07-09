"use client";
import { useState, useRef, useEffect, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";

interface Option {
    label: string;
    value: string;
    icon?: string;
}

interface GapSelectProps {
    options: Option[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    width?: number | string;
    label?: string;
    error?: string;
    icon?: ReactNode;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    name?: string;
    onBlur?: () => void;
}

const GapSelect = forwardRef<HTMLDivElement, GapSelectProps>(
    (
        {
            options,
            value = "",
            onChange,
            placeholder = "انتخاب کنید",
            width,
            label,
            error,
            icon,
            required = false,
            disabled = false,
            className = "",
            onBlur,
        },
        ref,
    ) => {
        const [isOpen, setIsOpen] = useState(false);
        const containerRef = useRef<HTMLDivElement>(null);

        const selectedOption = options.find((option) => option.value === value);

        // Close on click outside
        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (
                    containerRef.current &&
                    !containerRef.current.contains(event.target as Node)
                ) {
                    setIsOpen(false);
                    onBlur?.();
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () =>
                document.removeEventListener("mousedown", handleClickOutside);
        }, [onBlur]);

        const handleSelect = (optionValue: string) => {
            onChange?.(optionValue);
            setIsOpen(false);
            onBlur?.();
        };

        return (
            <div
                className={`space-y-1.5 ${className}`}
                style={{ width }}
                ref={ref}
            >
                {label && (
                    <label className="block text-sm">
                        {label}
                        {required && (
                            <span className="text-red-400 mr-1">*</span>
                        )}
                    </label>
                )}

                <div className="relative" ref={containerRef}>
                    {icon && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                            {icon}
                        </span>
                    )}

                    <button
                        type="button"
                        onClick={() => !disabled && setIsOpen(!isOpen)}
                        disabled={disabled}
                        className={`
                        flex items-center justify-between w-full py-2 
                        bg-black/5 rounded-xl
                        text-sm font-bold transition-all duration-300
                        h-12 pl-5 pr-2 border-2
                        ${icon && "pr-10"}
                        ${
                            error
                                ? "border-red-500/50"
                                : isOpen
                                ? "border-green-500/50 ring-2 ring-green-500/20"
                                : "border-white/10"
                        }
                        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    `}
                    >
                        <div className="flex items-center justify-between w-full truncate">
                            <span className="truncate">
                                {selectedOption
                                    ? selectedOption.label
                                    : placeholder}
                            </span>
                            <ChevronDown
                                className={`size-5 transition-transform duration-300 shrink-0 ${
                                    isOpen ? "rotate-180" : ""
                                }`}
                            />
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                        {isOpen && !disabled && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                                style={{ overflow: "hidden" }}
                                className="absolute z-50 w-full mt-2 py-1 divide-y-2
                                    glass-navbar backdrop-blur-md border border-white/10 
                                    bg-black/90 text-white rounded-xl shadow-2xl"
                            >
                                {options.map((option) => (
                                    <div
                                        key={option.value}
                                        onClick={() =>
                                            handleSelect(option.value)
                                        }
                                        className={`
                                        flex items-center justify-between px-3 py-2 mx-1 rounded-lg
                                        cursor-pointer text-sm font-bold transition-colors
                                        hover:bg-white/10
                                        ${
                                            value === option.value
                                                ? "bg-white/5"
                                                : ""
                                        }
                                    `}
                                    >
                                        <div className="flex items-center gap-2">
                                            {option.icon && (
                                                <Image
                                                    src={option.icon}
                                                    alt=""
                                                    width={15}
                                                    height={15}
                                                    className="flex-shrink-0"
                                                />
                                            )}
                                            {option.label}
                                        </div>

                                        {value === option.value && (
                                            <Check className="size-4 flex-shrink-0 text-green-500" />
                                        )}
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}
            </div>
        );
    },
);

GapSelect.displayName = "GapSelect";

export default GapSelect;
