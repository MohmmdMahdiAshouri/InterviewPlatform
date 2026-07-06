"use client"
import { motion } from "framer-motion";

interface SkeletonProps {
    className?: string;
    shimmer?: boolean;
}

function ShimmerOverlay() {
    return (
        <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        />
    );
}

export function Skeleton({ className = "", shimmer = true }: SkeletonProps) {
    return (
        <div
            className={`relative overflow-hidden rounded-lg bg-white/10 dark:bg-gray-700/50 ${className}`}
        >
            {shimmer && <ShimmerOverlay />}
        </div>
    );
}

export function SkeletonText({
    className = "",
    shimmer = true,
}: SkeletonProps) {
    return (
        <Skeleton
            className={`${className}`}
            shimmer={shimmer}
        />
    );
}

interface SkeletonTextMultiProps extends SkeletonProps {
    lines?: number;
    gap?: string;
}

export function SkeletonTextMulti({
    lines = 3,
    gap = "gap-3",
    className = "",
    shimmer = true,
}: SkeletonTextMultiProps) {
    return (
        <div className={`flex flex-col ${gap} ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={`h-4 ${i === lines - 1 ? "w-2/3" : "w-full"}`}
                    shimmer={shimmer}
                />
            ))}
        </div>
    );
}

interface SkeletonAvatarProps extends SkeletonProps {
    size?: "sm" | "md" | "lg";
}

const avatarSizes = {
    sm: "size-8",
    md: "size-12",
    lg: "size-16",
};

export function SkeletonAvatar({
    size = "md",
    className = "",
    shimmer = true,
}: SkeletonAvatarProps) {
    return (
        <Skeleton
            className={`${avatarSizes[size]} rounded-full ${className}`}
            shimmer={shimmer}
        />
    );
}

export default Skeleton;
