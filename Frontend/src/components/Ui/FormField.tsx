"use client";
import { ReactNode } from "react";
import { useFormContext, RegisterOptions, Controller } from "react-hook-form";
import Input from "./Input";
import Textarea from "./Textarea";
import Select from "./Select";

interface FormFieldProps {
    name: string;
    label?: string;
    type?: string;
    placeholder?: string;
    icon?: ReactNode;
    required?: boolean;
    as?: "input" | "textarea" | "select";
    options?: { value: string; label: string }[];
    validation?: RegisterOptions;
    className?: string;
    disabled?: boolean;
}

export default function FormField({
    name,
    label,
    type = "text",
    placeholder,
    icon,
    required = false,
    as = "input",
    options,
    validation,
    className,
    disabled,
}: FormFieldProps) {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext();

    const error = errors[name]?.message as string | undefined;

    const registerOptions: RegisterOptions = {
        required: required ? "این فیلد الزامی است" : undefined,
        ...validation,
    };

    if (as === "textarea") {
        return (
            <Textarea
                {...register(name, registerOptions)}
                label={label}
                error={error}
                icon={icon}
                placeholder={placeholder}
                className={className}
                disabled={disabled}
            />
        );
    }

    if (as === "select" && options) {
        return (
            <Controller
                name={name}
                control={control}
                rules={registerOptions}
                render={({ field }) => (
                    <Select
                        {...field}
                        options={options}
                        placeholder={placeholder}
                        label={label}
                        error={error}
                        icon={icon}
                        required={required}
                        disabled={disabled}
                        className={className}
                    />
                )}
            />
        );
    }

    return (
        <Input
            {...register(name, registerOptions)}
            type={type}
            label={label}
            error={error}
            icon={icon}
            placeholder={placeholder}
            required={required}
            className={className}
            disabled={disabled}
        />
    );
}
