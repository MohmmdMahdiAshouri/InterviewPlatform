"use client";

import { useState } from "react";
import Button from "@/src/components/Ui/Button";
import { useSendOtp } from "@/src/hooks/useAuth";

export default function LoginPage() {
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const sendOtp = useSendOtp();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendOtp.mutate({ phone, fullName });
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">ثبت نام</h1>
                    <p className="text-gray-400">
                        برای شروع، اطلاعات خود را وارد کنید
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 space-y-6"
                >
                    {sendOtp.isError && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 text-center">
                            {sendOtp.error instanceof Error
                                ? sendOtp.error.message
                                : "خطا در ارسال کد"}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                            نام کامل
                        </label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition-colors"
                            placeholder="نام خود را وارد کنید"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                            شماره تلفن
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition-colors"
                            placeholder="+989123456789"
                            dir="ltr"
                            required
                        />
                    </div>

                    <Button
                        loading={sendOtp.isPending}
                        size="md"
                        className="w-full"
                    >
                        ارسال کد تایید
                    </Button>
                </form>
            </div>
        </div>
    );
}
