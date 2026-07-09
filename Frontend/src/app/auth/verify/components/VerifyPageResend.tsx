interface VerifyPageResendProps {
    cooldown: number;
    formattedTime: string;
    handleResend: () => void;
}

function VerifyPageResend({
    cooldown,
    formattedTime,
    handleResend,
}: VerifyPageResendProps) {
    return (
        <div className="text-center">
            {cooldown > 0 ? (
                <p className="text-gray-400 text-sm">
                    ارسال مجدد کد در {formattedTime}
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
    );
}

export default VerifyPageResend;
