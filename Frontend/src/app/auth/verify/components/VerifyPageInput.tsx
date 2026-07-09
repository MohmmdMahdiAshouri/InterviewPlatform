import Input from "@/src/components/Ui/Input";
import { RefObject } from "react";

interface VerifyPageInputProps {
    code: string[];
    inputRefs: RefObject<(HTMLInputElement | null)[]>;
    handleChange: (index: number, value: string) => void;
    handleKeyDown: (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>
    ) => void;
    handlePaste: (
        e: React.ClipboardEvent<HTMLInputElement>
    ) => void;
    isPending: boolean
}

function VerifyPageInput({
    code,
    inputRefs,
    handleChange,
    handleKeyDown,
    handlePaste,
    isPending,
}: VerifyPageInputProps) {
    return (
        <div className="flex justify-center gap-3" dir="ltr">
            {code.map((digit, i) => (
                <Input
                    key={i}
                    ref={(el) => {
                        inputRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={i === 0 ? handlePaste : undefined}
                    disabled={isPending}
                    className="w-12 h-14 p-1! text-center text-xl font-bold rounded-xl border border-white/10 disabled:opacity-50"
                />
            ))}
        </div>
    );
}

export default VerifyPageInput;
