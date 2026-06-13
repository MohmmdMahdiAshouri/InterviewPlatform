import Link from "next/link";
import { ChevronLeftIcon, Code2Icon } from "lucide-react";


function ProblemsList() {
    return (
        <div className="flex flex-col gap-y-4!">
            <Link href={`/problem/#`}>
                <div className="border_gradient rounded-[22px] p-1! transition-transform duration-500 hover:-translate-y-2 hover:scale-105">
                    <div className="flex items-center justify-between gap-4 rounded-[15px] bg-card-bg text-card-text p-2">
                        <div className="flex items-center justify-between gap-x-5">
                            <Code2Icon className="size-8" />
                            <div className="flex flex-col">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-2xl font-bold text_gradient">
                                                برعکس کردن رشته (string)
                                            </h2>
                                            <span
                                                className={`bg-amber-400 p-1 rounded-2xl text-sm`}
                                            >
                                                متوسط
                                            </span>
                                        </div>
                                        <p className="text-md font-light">
                                            {" "}
                                            دسته بندی: رشته ها
                                        </p>
                                    </div>
                                </div>
                                <p className="">
                                    توضیحات: یک فانکشن بنویس که رشته رو برعکس
                                    کنه
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center bg_gradient p-2 rounded-3xl text-sm">
                            <span className="font-medium">حل کردن</span>
                            <ChevronLeftIcon className="size-5" />
                        </div>
                    </div>
                </div>
            </Link>
            <Link href={`/problem/#`}>
                <div className="border_gradient rounded-[22px] p-1! transition-transform duration-300 hover:-translate-y-2 hover:scale-105">
                    <div className="flex items-center justify-between gap-4 rounded-[15px] bg-card-bg text-card-text p-2">
                        <div className="flex items-center justify-between gap-x-5">
                            <Code2Icon className="size-8" />
                            <div className="flex flex-col">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-2xl font-bold text_gradient">
                                                برعکس کردن رشته (string)
                                            </h2>
                                            <span
                                                className={`bg-amber-400 p-1 rounded-2xl text-sm`}
                                            >
                                                متوسط
                                            </span>
                                        </div>
                                        <p className="text-md font-light">
                                            {" "}
                                            دسته بندی: رشته ها
                                        </p>
                                    </div>
                                </div>
                                <p className="">
                                    توضیحات: یک فانکشن بنویس که رشته رو برعکس
                                    کنه
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center bg_gradient p-2 rounded-3xl text-sm">
                            <span className="font-medium">حل کردن</span>
                            <ChevronLeftIcon className="size-5" />
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default ProblemsList;
