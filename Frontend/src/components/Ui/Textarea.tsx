import { TextareaHTMLAttributes, forwardRef, ReactNode } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    icon?: ReactNode;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
                        <span className="absolute right-3 top-3 text-gray-400">
                            {icon}
                        </span>
                    )}
                    <textarea
                        ref={ref}
                        className={`
                            w-full rounded-xl min-h-25
                            bg-black/5 border-2
                            placeholder:text-gray-400
                            transition-colors duration-300
                            focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20
                            disabled:opacity-50 disabled:cursor-not-allowed
                            resize-none px-5 font-light
                            ${icon && "pr-10 pt-3"}
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

Textarea.displayName = "Textarea";

export default Textarea;
