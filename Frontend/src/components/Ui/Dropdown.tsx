"use client";

import {
    ReactNode,
    useEffect,
    useRef,
    useState,
    forwardRef,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface DropdownItem {
    label: string;
    icon?: ReactNode;
    danger?: boolean;
    divider?: boolean;
    onClick?: () => void;
}

interface DropdownProps {
    trigger: ReactNode;
    items: DropdownItem[];
    header?: ReactNode;
    width?: number | string;
    className?: string;
}

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
    (
        {
            trigger,
            items,
            header,
            width = 240,
            className = "",
        },
        ref,
    ) => {
        const [isOpen, setIsOpen] = useState(false);

        const containerRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            function handleClickOutside(event: MouseEvent) {
                if (
                    containerRef.current &&
                    !containerRef.current.contains(event.target as Node)
                ) {
                    setIsOpen(false);
                }
            }

            document.addEventListener(
                "mousedown",
                handleClickOutside,
            );

            return () =>
                document.removeEventListener(
                    "mousedown",
                    handleClickOutside,
                );
        }, []);

        return (
            <div
                ref={ref}
                className={`relative ${className}`}
            >
                <div ref={containerRef}>
                    <div
                        onClick={() => setIsOpen((prev) => !prev)}
                        className="cursor-pointer"
                    >
                        {trigger}
                    </div>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: -8,
                                    scale: 0.97,
                                    filter: "blur(8px)",
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                    filter: "blur(0px)",
                                }}
                                exit={{
                                    opacity: 0,
                                    y: -8,
                                    scale: 0.97,
                                    filter: "blur(8px)",
                                }}
                                transition={{
                                    duration: 0.22,
                                    ease: "easeOut",
                                }}
                                style={{ width }}
                                className="
                                    absolute
                                    left-0
                                    mt-3
                                    z-50
                                "
                            >
                                {/* Animated Border */}
                                <div
                                    className="
                                        relative
                                        overflow-hidden
                                        rounded-2xl
                                        p-[1px]
                                    "
                                >

                                    {/* Content */}
                                    <div
                                        className="
                                            relative
                                            rounded-2xl
                                            text-white   
                                            bg-black/50!
                                            dark:bg-black/70

                                            backdrop-blur-3xl

                                            border
                                            border-white/10

                                            shadow-2xl
                                            overflow-hidden
                                        "
                                    >
                                        {header && (
                                            <div
                                                className="
                                                    px-4
                                                    py-3
                                                    border-b
                                                    border-white/10
                                                "
                                            >
                                                {header}
                                            </div>
                                        )}

                                        <div className="p-1">
                                            {items.map(
                                                (
                                                    item,
                                                    index,
                                                ) => (
                                                    <div
                                                        key={
                                                            index
                                                        }
                                                    >
                                                        {item.divider && (
                                                            <div className="h-px bg-white/10 my-1" />
                                                        )}

                                                        <button
                                                            onClick={() => {
                                                                item.onClick?.();

                                                                setIsOpen(
                                                                    false,
                                                                );
                                                            }}
                                                            className={`
                                                                w-full

                                                                flex
                                                                items-center
                                                                gap-3

                                                                rounded-xl

                                                                px-3
                                                                py-2.5

                                                                transition-all
                                                                duration-200

                                                                hover:bg-white/10

                                                                ${
                                                                    item.danger
                                                                        ? "text-red-400 hover:bg-red-500/10"
                                                                        : ""
                                                                }
                                                            `}
                                                        >
                                                            {item.icon}

                                                            <span className="font-medium">
                                                                {
                                                                    item.label
                                                                }
                                                            </span>
                                                        </button>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        );
    },
);

Dropdown.displayName = "Dropdown";

export default Dropdown;