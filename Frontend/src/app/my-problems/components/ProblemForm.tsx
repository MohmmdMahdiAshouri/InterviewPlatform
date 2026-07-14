"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import Form, { useFormContext } from "@/src/components/Ui/Form";
import FormField from "@/src/components/Ui/FormField";
import Button from "@/src/components/Ui/Button";
import { getErrorMessage } from "@/src/libs/getErrorMessage";
import type { Problem, CreateProblemPayload } from "@/src/types/problem.type";
import { problemSchema } from "@/src/validations/problem.shcema";

type ProblemFormData = z.infer<typeof problemSchema>;

const difficultyOptions = [
    { value: "EASY", label: "آسان" },
    { value: "MEDIUM", label: "متوسط" },
    { value: "HARD", label: "سخت" },
];

const visibilityOptions = [
    { value: "PRIVATE", label: "خصوصی" },
    { value: "PUBLIC", label: "عمومی" },
];

interface ProblemFormProps {
    mode: "create" | "edit";
    initialData?: Problem;
    onSubmit: (data: CreateProblemPayload) => Promise<void>;
    isLoading?: boolean;
}

function ProblemFormFields({
    mode,
    initialData,
}: {
    mode: "create" | "edit";
    initialData?: Problem;
}) {
    const { setValue } = useFormContext();

    useEffect(() => {
        if (initialData) {
            setValue("title", initialData.title);
            setValue("description", initialData.description);
            setValue("category", initialData.category);
            setValue("difficulty", initialData.difficulty);
            setValue("visibility", initialData.visibility);
            if (initialData.starterCode) {
                setValue(
                    "starterCodeJs",
                    initialData.starterCode.javascript || "",
                );
                setValue(
                    "starterCodePython",
                    initialData.starterCode.python || "",
                );
                setValue("starterCodeJava", initialData.starterCode.java || "");
            }
            if (initialData.constraints) {
                setValue("constraints", initialData.constraints.join("\n"));
            }
        }
    }, [initialData, setValue]);

    return (
        <>
            <FormField
                name="title"
                label="عنوان"
                placeholder="عنوان مسئله"
                required
            />
            <FormField
                name="description"
                label="توضیحات"
                placeholder="توضیحات مسئله"
                as="textarea"
                required
            />
            <FormField
                name="category"
                label="دسته‌بندی"
                placeholder="مثلاً: رشته‌ها، آرایه‌ها، ..."
                required
            />
            <FormField
                name="difficulty"
                label="سطح دشواری"
                as="select"
                options={difficultyOptions}
                required
            />
            <FormField
                name="visibility"
                label="وضعیت نمایش"
                as="select"
                options={visibilityOptions}
                required
            />
            <FormField
                name="starterCodeJs"
                label="کد شروع (جاوا اسکریپت)"
                placeholder="کد شروع جاوا اسکریپت"
                as="textarea"
            />
            <FormField
                name="starterCodePython"
                label="کد شروع (پایتون)"
                placeholder="کد شروع پایتون"
                as="textarea"
            />
            <FormField
                name="starterCodeJava"
                label="کد شروع (جاوا)"
                placeholder="کد شروع جاوا"
                as="textarea"
            />
            <FormField
                name="constraints"
                label="محدودیت‌ها (هر خط یک مورد)"
                placeholder="مثلاً: 1 <= n <= 10^5"
                as="textarea"
            />
        </>
    );
}

export default function ProblemForm({
    mode,
    initialData,
    onSubmit,
    isLoading,
}: ProblemFormProps) {
    const router = useRouter();
    const [serverError, setServerError] = useState<string>("");

    const defaultValues: ProblemFormData = {
        title: "",
        description: "",
        category: "",
        difficulty: "MEDIUM",
        visibility: "PRIVATE",
        starterCodeJs: "",
        starterCodePython: "",
        starterCodeJava: "",
        constraints: "",
    };

    const handleSubmit = async (data: ProblemFormData) => {
        try {
            setServerError("");

            const starterCode: Record<string, string> = {};
            if (data.starterCodeJs) starterCode.javascript = data.starterCodeJs;
            if (data.starterCodePython)
                starterCode.python = data.starterCodePython;
            if (data.starterCodeJava) starterCode.java = data.starterCodeJava;

            const constraints = data.constraints
                ? data.constraints.split("\n").filter((c) => c.trim())
                : [];

            const payload: CreateProblemPayload = {
                title: data.title,
                description: data.description,
                category: data.category,
                difficulty: data.difficulty,
                visibility: data.visibility,
                starterCode:
                    Object.keys(starterCode).length > 0
                        ? starterCode
                        : undefined,
                constraints: constraints.length > 0 ? constraints : undefined,
            };

            await onSubmit(payload);

            router.push("/my-problems");
        } catch (error) {
            const message = getErrorMessage(error);
            setServerError(message);
        }
    };

    return (
        <Form
            schema={problemSchema}
            onSubmit={handleSubmit}
            defaultValues={defaultValues}
            serverError={serverError}
            className="space-y-4"
        >
            <ProblemFormFields mode={mode} initialData={initialData} />
            <div className="flex gap-3 pt-4">
                <Button type="submit" loading={isLoading} className="flex-1">
                    {mode === "create" ? "ایجاد مسئله" : "ذخیره تغییرات"}
                </Button>
                <Button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 bg-white/10 hover:bg-white/20"
                >
                    انصراف
                </Button>
            </div>
        </Form>
    );
}
