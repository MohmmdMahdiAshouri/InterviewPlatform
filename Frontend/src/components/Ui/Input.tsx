import { InputHTMLAttributes, forwardRef, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, className = "", ...props }, ref) => {
        return (
            <div className="space-y-1.5">
                {label && (
                    <label className="block text-sm">
                        {label}
                        {props.required && (
                            <span className="text-red-400 mr-1">*</span>
                        )}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {icon}
                        </span>
                    )}
                    <input
                        ref={ref}
                        className={`
                            w-full h-12 rounded-xl px-5
                            bg-black/5 border-2
                            placeholder:text-gray-400
                            transition-colors duration-300
                            focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20
                            disabled:opacity-50 disabled:cursor-not-allowed
                            ${icon && "pr-10"}
                            ${
                                error
                                    ? "border-red-500/50"
                                    : "border-white/10"
                            }
                            ${className}
                        `}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-red-400 text-sm">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
