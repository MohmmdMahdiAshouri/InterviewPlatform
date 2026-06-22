"use client";
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { BookOpen, MessageSquare, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CodePanelWorkspace from "@/src/components/CodePanelWorkspace/CodePanelWorkspace";
import ProblemDescription from "@/src/components/CodePanelWorkspace/ProblemDescription";
import VideoCallUi from "./VideoCallUi";

interface TabItem {
    title: "description" | "video" | "chat";
    value: string;
    component: React.ReactNode;
    icon: React.ReactNode;
}

type TabType = TabItem["title"];

const content: readonly TabItem[] = [
    { title: "description", value: "توضیحات مسئله", component: <ProblemDescription />, icon: <BookOpen className="w-4 h-4" /> },
    { title: "video", value: "ویدیو کال", component: <VideoCallUi />, icon: <Video className="w-4 h-4" /> },
    { title: "chat", value: "چت", component: <VideoCallUi />, icon: <MessageSquare className="w-4 h-4" /> },
];

function Interview() {
    const [activeTab, setActiveTab] = useState<TabType>("description");
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

    const containerRef = useRef<HTMLDivElement>(null);
    const tabRefs = useRef<Record<TabType, HTMLButtonElement | null>>({
        description: null,
        video: null,
        chat: null,
    });

    // تابع به‌روزرسانی موقعیت نشانگر
    const updateIndicator = (tab: TabType) => {
        const button = tabRefs.current[tab];
        const container = containerRef.current;
        if (button && container) {
            const containerRect = container.getBoundingClientRect();
            const buttonRect = button.getBoundingClientRect();
            setIndicatorStyle({
                left: buttonRect.left - containerRect.left,
                width: buttonRect.width,
            });
        }
    };

    // محاسبه موقعیت در اولین رندر و پس از تغییر تب
    useLayoutEffect(() => {
        // تاخیر کوتاه برای اطمینان از Layout کامل
        const timer = setTimeout(() => updateIndicator(activeTab), 50);
        return () => clearTimeout(timer);
    }, [activeTab]);

    // به‌روزرسانی هنگام تغییر سایز پنجره
    useEffect(() => {
        const handleResize = () => updateIndicator(activeTab);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [activeTab]);

    const handleTabClick = (tab: TabType) => {
        setActiveTab(tab);
        // بلافاصله بعد از کلیک موقعیت را به‌روز می‌کنیم
        updateIndicator(tab);
    };

    const activeComponent = content.find((item) => item.title === activeTab)?.component;

    return (
        <CodePanelWorkspace
            rightPanelContent={
                <div className="h-full flex flex-col">
                    {/* نوار تب‌ها */}
                    <div
                        ref={containerRef}
                        className="relative flex items-center justify-center border-b border-[#2d3139] py-3 gap-1"
                    >
                        {/* نشانگر متحرک با گرادینت و سایه نئون */}
                        <motion.div
                            className="absolute h-[70%] rounded-full bg-gradient-to-r from-green-600 to-lime-400 backdrop-blur-md shadow-[0_0_20px_rgba(34,197,94,0.45),0_0_28px_rgba(16,185,129,0.35),0_0_48px_rgba(132,204,22,0.25)]"
                            style={{ top: "50%", transform: "translateY(-50%)" }}
                            animate={indicatorStyle}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />

                        {content.map((item) => {
                            const isActive = activeTab === item.title;
                            return (
                                <button
                                    key={item.title}
                                    ref={(el) => {
                                        tabRefs.current[item.title] = el;
                                    }}
                                    onClick={() => handleTabClick(item.title)}
                                    className={`relative z-10 px-4 py-2 rounded-full flex items-center gap-2 transition-colors bg-transparent shadow-none ${
                                        isActive ? "text-white" : "text-gray-400 hover:text-white"
                                    }`}
                                >
                                    {item.value}
                                    {item.icon}
                                </button>
                            );
                        })}
                    </div>

                    {/* محتوای تب با انیمیشن ورود/خروج */}
                    <div className="flex-1 overflow-hidden relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                className="h-full w-full"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                            >
                                {activeComponent}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            }
        />
    );
}

export default Interview;