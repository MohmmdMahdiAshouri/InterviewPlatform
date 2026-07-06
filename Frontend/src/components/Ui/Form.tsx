"use client";
import { ReactNode, useEffect } from "react";
import { ZodType } from "zod";
import {
    useForm,
    FormProvider,
    useFormContext as RHFUseFormContext,
    FieldValues,
    SubmitHandler,
    DefaultValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNotification } from "./Notification";

interface FormProps<T extends FieldValues> {
    schema: ZodType<T, T>;
    onSubmit: SubmitHandler<T>;
    defaultValues?: DefaultValues<T>;
    children: ReactNode;
    className?: string;
    serverError?: string;
}

export function useFormContext<T extends FieldValues>() {
    return RHFUseFormContext<T>();
}

export default function Form<T extends FieldValues>({
    schema,
    onSubmit,
    defaultValues,
    children,
    className = "",
    serverError,
}: FormProps<T>) {
    const methods = useForm<T>({
        resolver: zodResolver(schema),
        defaultValues,
    });

    const { addNotification } = useNotification();

    useEffect(() => {
        if (!serverError) return;
        addNotification({
            type: "error",
            title: "خطا",
            message: "خطایی رخ داده است لطفا دوباره تلاش کنید",
        });
    }, [serverError, addNotification]);

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className={`space-y-5 ${className}`}
                noValidate
            >
                {children}
            </form>
        </FormProvider>
    );
}
