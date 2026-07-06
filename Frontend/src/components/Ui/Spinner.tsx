import { motion } from "framer-motion";

interface SpinnerProps {
    size?: number;
    className?: string;
    color?: string;
}

export function Spinner({ size = 24, className = "" }: SpinnerProps) {
    return (
        <motion.div
            className={`rounded-full border-2 border-current border-t-transparent ${className}`}
            style={{ width: size, height: size }}
            animate={{ rotate: 360 }}
            transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
            }}
        />
    );
}

export function SpinnerDots({ size = 24, className = "" }: SpinnerProps) {
    return (
        <div className={`flex items-center gap-1 ${className}`}>
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="rounded-full bg-current"
                    style={{ width: size / 4, height: size / 4 }}
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}

export default Spinner;
