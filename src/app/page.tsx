import {
    CodeXmlIcon,
    Shapes,
    UsersIcon,
    VideoIcon,
} from "lucide-react";
import Image from "next/image";

export default function Home() {
    return (
        <div>
            {/* HERO SECTION */}
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* LEFT CONTENT */}
                    <div className="space-y-8">
                        <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                            <span className="text-base-content">
                                مصاحبه به سبک نوین
                            </span>
                        </h1>

                        <p className="text-xl font-light leading-relaxed max-w-xl">
                            پلتفرمی بی‌نظیر برای مصاحبه‌های کدنویسی مشارکتی و
                            برنامه‌نویسی دونفره. به صورت رو در رو ارتباط برقرار
                            کنید، در لحظه کدنویسی کنید و در مصاحبه‌های فنی خود
                            بدرخشید.
                        </p>

                        {/* FEATURE PILLS */}
                        <div className="flex flex-wrap gap-10">
                            <div className="bg_gradient rounded-[20px] p-0.5 ">
                                <div className="text-light rounded-[18px] flex justify-center items-center gap-1 p-1 h-15">
                                    تماس تصویری
                                    <VideoIcon className="size-6" />
                                </div>
                            </div>
                            <div className="bg_gradient rounded-[20px] p-0.5">
                                <div className="text-light rounded-[18px] flex justify-center items-center gap-1 p-1 h-15">
                                    کد نویسی زنده
                                    <CodeXmlIcon className="size-6" />
                                </div>
                            </div>
                            <div className="bg_gradient rounded-[20px] p-0.5">
                                <div className="text-light rounded-[18px] flex justify-center items-center gap-1 p-1 h-15">
                                    زبان های متنوع
                                    <Shapes className="size-6" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT IMAGE */}
                    <div className="inline-block rounded-[30px] bg_gradient p-1 ">
                        <Image
                            src="/images/hero.png"
                            alt="Hero image"
                            width={520}
                            height={520}
                            priority
                            className="block w-full rounded-[28px] bg-foreground object-cover transition-colors duration-500"
                        />
                    </div>
                </div>
            </div>

            {/* FEATURES SECTION */}
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">
                        هرچیزی که برای یک مصاحبه{" "}
                        <span className="text_gradient">موفق </span> نیاز دارید
                    </h2>
                    <p className="text-lg font-light max-w-2xl mx-auto">
                        ویژگی‌های قدرتمندی که برای یکپارچه و پربار کردن
                        مصاحبه‌های کدنویسی شما طراحی شده‌اند
                    </p>
                </div>

                {/* FEATURES GRID */}
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="bg_gradient p-1 rounded-[15px] shadow-xl">
                        <div className="bg-foreground h-full w-full px-4  rounded-[13px] flex flex-col gap-y-2 items-center justify-center text-center">
                            <VideoIcon className="size-8" />
                            <div className="w-full rounded-2xl flex items-center justify-center">
                                <h3 className="font-bold">
                                    تماس تصویری با کیفیت HD
                                </h3>
                            </div>
                            <p className="font-light">
                                صدا و تصویر شفاف برای ارتباط بی‌وقفه در طول
                                مصاحبه‌های شما
                            </p>
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg_gradient p-1 rounded-[15px] shadow-xl">
                        <div className="bg-foreground h-full w-full px-4 py-3 rounded-[13px] flex flex-col gap-y-2 items-center justify-center text-center">
                            <CodeXmlIcon className="size-8" />
                            <div className="w-full rounded-2xl flex items-center justify-center">
                                <h3 className="font-bold">کد نویسی زنده</h3>
                            </div>
                            <p className="font-light">
                                با هایلایت کردن سینتکس و پشتیبانی از چندین زبان،
                                به صورت بلادرنگ همکاری کنید
                            </p>
                        </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg_gradient p-1 rounded-[15px] shadow-xl">
                        <div className="bg-foreground h-full w-full px-4 py-3 rounded-[13px] flex flex-col gap-y-2 items-center justify-center text-center">
                            <UsersIcon className="size-8" />
                            <div className="w-full rounded-2xl flex items-center justify-center">
                                <h3 className="font-bold">همکاری آسان</h3>
                            </div>
                            <p className="font-light">
                                صفحه نمایش خود را به اشتراک بگذارید، در مورد
                                راه‌حل‌ها بحث کنید و از یکدیگر به صورت بلادرنگ
                                یاد بگیرید
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
