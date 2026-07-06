"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/src/components/Ui/Button";
import { useCheckOtp, useSendOtp } from "@/src/hooks/useAuth";

export default function VerifyOtpPage() {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [cooldown, setCooldown] = useState(60);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const searchParams = useSearchParams();
    const phone = searchParams.get("phone");
    const router = useRouter();

    const checkOtp = useCheckOtp();
    const sendOtp = useSendOtp();

    useEffect(() => {
        if (!phone) {
            router.push("/auth/login");
        }
        inputRefs.current[0]?.focus();
    }, [phone, router]);

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        if (newCode.every((digit) => digit !== "")) {
            submitCode(newCode.join(""));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6);
        if (pasted.length === 6) {
            const newCode = pasted.split("");
            setCode(newCode);
            inputRefs.current[5]?.focus();
            submitCode(pasted);
        }
    };

    const submitCode = async (otpCode: string) => {
        if (!phone) return;
        setError("");

        try {
            await checkOtp.mutateAsync({ phone, code: otpCode });
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Verification failed",
            );
            setCode(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        }
    };

    const handleResend = () => {
        if (!phone || cooldown > 0) return;
        setCooldown(60);
        sendOtp.mutate({ phone, fullName: "" });
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">تایید شماره تلفن</h1>
                    <p className="text-gray-400">
                        کد ۶ رقمی ارسال شده به {phone} را وارد کنید
                    </p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 text-center">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-center gap-3" dir="ltr">
                        {code.map((digit, i) => (
                            <input
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
                                disabled={checkOtp.isPending}
                                className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-green-500/50 transition-colors disabled:opacity-50"
                            />
                        ))}
                    </div>

                    <Button
                        loading={checkOtp.isPending}
                        size="md"
                        className="w-full"
                        onClick={() => submitCode(code.join(""))}
                    >
                        تایید
                    </Button>

                    <div className="text-center">
                        {cooldown > 0 ? (
                            <p className="text-gray-400 text-sm">
                                ارسال مجدد کد در {cooldown} ثانیه
                            </p>
                        ) : (
                            <button
                                onClick={handleResend}
                                className="text-green-400 hover:text-green-300 text-sm transition-colors"
                            >
                                ارسال مجدد کد
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
