"use client";
import { z } from "zod";
import { useSendOtp } from "@/src/hooks/useAuth";
import { AxiosError } from "axios";
import { Phone, User } from "lucide-react";
import { loginSchema } from "@/src/validations/login.schema";
import Form from "@/src/components/Ui/Form";
import FormField from "@/src/components/Ui/FormField";
import Button from "@/src/components/Ui/Button";
import { getErrorMessage } from "@/src/libs/getErrorMessage";

type LoginFormData = z.infer<typeof loginSchema>;

function LoginPageForm() {
    const sendOtp = useSendOtp();

    const handleSubmit = (data: LoginFormData) => {
        sendOtp.mutate(data);
    };
    
    const serverError = sendOtp.error
        ? getErrorMessage(sendOtp.error)
        : undefined;

    return (
        <div className="form_card">
            <Form
                schema={loginSchema}
                onSubmit={handleSubmit}
                serverError={serverError}
            >
                <FormField
                    name="phone"
                    label="شماره تلفن"
                    type="tel"
                    placeholder="09123456789"
                    icon={<Phone size={18} />}
                    required={true}
                    as="input"
                />

                <FormField
                    name="fullName"
                    label="نام و نام خانوادگی"
                    type="text"
                    placeholder="نام خود را وارد کنید"
                    as="input"
                    icon={<User size={18} />}
                    required={true}
                />

                <Button
                    type="submit"
                    loading={sendOtp.isPending}
                    className="w-full"
                    size="md"
                >
                    ارسال کد
                </Button>
            </Form>
        </div>
    );
}

export default LoginPageForm;
