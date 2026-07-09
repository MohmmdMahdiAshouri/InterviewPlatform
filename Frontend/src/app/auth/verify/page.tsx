"use client";
import { useState, useEffect, useRef } from "react";
import { useCheckOtp, useSendOtp } from "@/src/hooks/useAuth";
import Button from "@/src/components/Ui/Button";
import { useRouter } from "next/navigation";
import { useNotification } from "@/src/components/Ui/Notification";
import VerifyPageHeader from "./components/VerifyPageHeader";
import VerifyPageInput from "./components/VerifyPageInput";
import VerifyPageResend from "./components/VerifyPageResend";
import { getErrorMessage } from "@/src/libs/getErrorMessage";

export default function VerifyOtpPage() {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [otpData, setOtpData] = useState<{
        phone: string;
        fullName: string;
        expiresAt: string;
        offset: number;
    } | null>(() => {
        if (typeof window === "undefined") return null;
        const raw = sessionStorage.getItem("otp");
        return raw ? JSON.parse(raw) : null;
    });
    const [cooldown, setCooldown] = useState(0);

    const router = useRouter();

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const checkOtp = useCheckOtp();
    const sendOtp = useSendOtp();

    const {addNotification} = useNotification()

    const error = checkOtp.error ? getErrorMessage(checkOtp.error) : "";

    useEffect(() => {
        if (!otpData) {
            router.push("/auth/login");
            return;
        }
        inputRefs.current[0]?.focus();
    }, [otpData, router]);

    useEffect(() => {
        if (!otpData) return;

        const updateRemaining = () => {
            const serverNow = Date.now() - otpData.offset;

            const remaining = Math.max(
                0,
                Math.ceil(
                    (new Date(otpData.expiresAt).getTime() - serverNow) / 1000,
                ),
            );

            setCooldown(remaining);
        };

        updateRemaining();

        const timer = setInterval(updateRemaining, 1000);

        return () => clearInterval(timer);
    }, [otpData]);

    const minutes = Math.floor(cooldown / 60);
    const seconds = cooldown % 60;
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

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
        if (checkOtp.isPending) return;
        if (!otpData) return;
        if (otpCode.length < 6) return;

        checkOtp.mutate(
            { phone: otpData.phone, code: otpCode },
            {
                onError: () => {
                    setCode(["", "", "", "", "", ""]);
                    addNotification({
                        title: "خطایی رخ داده است",
                        type: "error",
                        message: error
                    })
                    inputRefs.current[0]?.focus();
                },
            },
        );
    };

    const handleResend = () => {
        if (!otpData || cooldown > 0 || sendOtp.isPending) return;

        sendOtp.mutate(
            { phone: otpData.phone, fullName: otpData.fullName },
            {
                onSuccess: (data, variables) => {
                    const offset =
                        Date.now() - new Date(data.serverTime).getTime();

                    const newOtp = {
                        phone: variables.phone,
                        fullName: variables.fullName,
                        expiresAt: data.expiresAt,
                        offset,
                    };

                    sessionStorage.setItem("otp", JSON.stringify(newOtp));

                    setOtpData(newOtp);
                },
            },
        );
    };

    return (
        <div className="mt-20 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <VerifyPageHeader phone={otpData?.phone} />

                <div className="backdrop-blur-xl rounded-2xl p-8 border-2 border-green-500/50 ring-2 ring-green-500/20 space-y-6">
                    
                    <VerifyPageInput 
                        code={code}
                        inputRefs={inputRefs}
                        handleChange={handleChange}
                        handleKeyDown={handleKeyDown}
                        handlePaste={handlePaste}
                        isPending={checkOtp.isPending}
                    />

                    <div className="flex justify-between items-center">
                        <Button
                            loading={checkOtp.isPending}
                            size="md"
                            className="w-full"
                            onClick={() => submitCode(code.join(""))}
                        >
                            تایید
                        </Button>

                        <VerifyPageResend 
                            cooldown={cooldown}
                            formattedTime={formattedTime}
                            handleResend={handleResend}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
