"use client";
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import {
    BookOpen,
    MessageSquare,
    Video,
    Users,
    Copy,
    Check,
    Play,
    Square,
    Send,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CodePanelWorkspace from "@/src/components/CodePanelWorkspace/CodePanelWorkspace";
import ProblemDescription from "@/src/components/CodePanelWorkspace/ProblemDescription";
import VideoCallUi from "./VideoCallUi";
import Button from "@/src/components/Ui/Button";
import Input from "@/src/components/Ui/Input";
import { useUpdateInterviewStatus } from "@/src/hooks/useInterview";
import { useInterviewSocket } from "@/src/hooks/useInterviewSocket";
import type { Interview } from "@/src/types/interview.type";
import type { User } from "@/src/types/auth.type";
import type { Problem } from "@/src/types/problem.type";

interface InterviewProps {
    interview: Interview;
    currentUser: User;
}

type TabType = "description" | "video" | "chat";

const statusConfig: Record<
    string,
    { label: string; className: string }
> = {
    SCHEDULED: {
        label: "برنامه‌ریزی شده",
        className: "bg-blue-500/10 text-blue-400 border border-blue-500/50",
    },
    ACTIVE: {
        label: "فعال",
        className: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/50",
    },
    ENDED: {
        label: "پایان یافته",
        className: "bg-gray-500/10 text-gray-400 border border-gray-500/50",
    },
};

function Interview({ interview, currentUser }: InterviewProps) {
    const [activeTab, setActiveTab] = useState<TabType>("description");
    const [activeProblemIndex, setActiveProblemIndex] = useState(0);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
    const [copied, setCopied] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const tabRefs = useRef<Record<TabType, HTMLButtonElement | null>>({
        description: null,
        video: null,
        chat: null,
    });

    const updateStatus = useUpdateInterviewStatus();

    // Socket.io connection — persists across tab switches
    const {
        messages,
        connectionError,
        sendMessage,
        emitCodeUpdate,
        onCodeUpdate,
    } = useInterviewSocket(interview.id);

    const isHost = interview.hostId === currentUser.id;
    const status = statusConfig[interview.status];

    // Get the active problem
    const activeProblem = interview.problems[activeProblemIndex]?.problem as
        | (Interview["problems"][0]["problem"] & Problem)
        | undefined;

    // Auto-scroll chat to bottom on new messages
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Tab indicator logic
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

    useLayoutEffect(() => {
        const timer = setTimeout(() => updateIndicator(activeTab), 50);
        return () => clearTimeout(timer);
    }, [activeTab]);

    useEffect(() => {
        const handleResize = () => updateIndicator(activeTab);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [activeTab]);

    const handleTabClick = (tab: TabType) => {
        setActiveTab(tab);
        updateIndicator(tab);
    };

    const copyRoomCode = () => {
        if (interview.roomCode) {
            navigator.clipboard.writeText(interview.roomCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleStatusChange = (newStatus: "ACTIVE" | "ENDED") => {
        updateStatus.mutate({
            id: interview.id,
            payload: { status: newStatus },
        });
    };

    const handleChatSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (chatInput.trim()) {
            sendMessage(chatInput.trim());
            setChatInput("");
        }
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const tabs: { title: TabType; value: string; icon: React.ReactNode }[] = [
        { title: "description", value: "توضیحات مسئله", icon: <BookOpen className="w-4 h-4" /> },
        { title: "video", value: "ویدیو کال", icon: <Video className="w-4 h-4" /> },
        { title: "chat", value: "چت", icon: <MessageSquare className="w-4 h-4" /> },
    ];

    return (
        <div className="h-full flex flex-col">
            {/* Room Header */}
            <div className="border-b border-[#2d3139] bg-base-200 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold text_gradient">
                            {interview.title}
                        </h1>
                        <span
                            className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-medium ${status.className}`}
                        >
                            {status.label}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Room code (host only) */}
                        {isHost && interview.roomCode && (
                            <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5">
                                <span className="text-xs opacity-60">کد اتاق:</span>
                                <span
                                    dir="ltr"
                                    className="font-mono font-bold text_gradient"
                                >
                                    {interview.roomCode}
                                </span>
                                <button
                                    onClick={copyRoomCode}
                                    className="p-1 rounded hover:bg-white/10 transition-colors"
                                    title="کپی کد"
                                >
                                    {copied ? (
                                        <Check className="size-3.5 text-emerald-400" />
                                    ) : (
                                        <Copy className="size-3.5" />
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Participants count */}
                        <div className="flex items-center gap-1.5 text-sm opacity-70">
                            <Users className="size-4" />
                            <span>{interview.participants.length}</span>
                        </div>

                        {/* Host-only status controls */}
                        {isHost && interview.status !== "ENDED" && (
                            <div className="flex items-center gap-2">
                                {interview.status === "SCHEDULED" && (
                                    <Button
                                        size="sm"
                                        onClick={() => handleStatusChange("ACTIVE")}
                                        loading={updateStatus.isPending}
                                        icon={<Play className="size-4" />}
                                    >
                                        شروع مصاحبه
                                    </Button>
                                )}
                                {interview.status === "ACTIVE" && (
                                    <Button
                                        size="sm"
                                        onClick={() => handleStatusChange("ENDED")}
                                        loading={updateStatus.isPending}
                                        icon={<Square className="size-4" />}
                                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50"
                                    >
                                        پایان مصاحبه
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Participants list */}
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <span className="text-xs opacity-60">شرکت‌کنندگان:</span>
                    {interview.participants.map((p) => (
                        <span
                            key={p.id}
                            className="text-xs bg-white/5 rounded-lg px-2 py-0.5"
                        >
                            {p.user.fullName}
                            {p.userId === interview.hostId && (
                                <span className="text-primary mr-1">(میزبان)</span>
                            )}
                        </span>
                    ))}
                </div>

                {/* Connection error banner */}
                {connectionError && (
                    <div className="mt-2 p-2 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
                        {connectionError}
                    </div>
                )}
            </div>

            {/* Main content area */}
            <div className="flex-1 flex min-h-0">
                {/* Problem switcher sidebar */}
                {interview.problems.length > 1 && (
                    <div className="w-48 border-l border-[#2d3139] bg-base-200 overflow-y-auto">
                        <div className="p-2">
                            <span className="text-xs font-medium opacity-60 px-2 mb-2 block">
                                مسائل ({interview.problems.length})
                            </span>
                            {interview.problems.map((ip, index) => (
                                <button
                                    key={ip.problem.id}
                                    onClick={() => setActiveProblemIndex(index)}
                                    className={`w-full text-right px-3 py-2 rounded-lg text-sm transition-all duration-200 mb-1 ${
                                        activeProblemIndex === index
                                            ? "bg-green-500/20 text-green-400 border border-green-500/50"
                                            : "hover:bg-white/5 text-gray-400"
                                    }`}
                                >
                                    <div className="truncate font-medium">
                                        {ip.problem.title}
                                    </div>
                                    <div className="text-xs opacity-60 truncate">
                                        {ip.problem.category}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Right panel: tabs + content */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Tab bar */}
                    <div
                        ref={containerRef}
                        className="relative flex items-center justify-center border-b border-[#2d3139] py-3 gap-1"
                    >
                        <motion.div
                            className="absolute h-[70%] rounded-full bg-gradient-to-r from-green-600 to-lime-400 backdrop-blur-md shadow-[0_0_20px_rgba(34,197,94,0.45),0_0_28px_rgba(16,185,129,0.35),0_0_48px_rgba(132,204,22,0.25)]"
                            style={{ top: "50%", transform: "translateY(-50%)" }}
                            animate={indicatorStyle}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />

                        {tabs.map((item) => {
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

                    {/* Tab content */}
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
                                {activeTab === "description" && activeProblem && (
                                    <CodePanelWorkspace
                                        rightPanelContent={
                                            <ProblemDescription problem={activeProblem} />
                                        }
                                        starterCode={activeProblem.starterCode}
                                        interviewId={interview.id}
                                        problemId={activeProblem.id}
                                        emitCodeUpdate={emitCodeUpdate}
                                        onCodeUpdate={onCodeUpdate}
                                    />
                                )}
                                {activeTab === "description" && !activeProblem && (
                                    <div className="h-full flex items-center justify-center">
                                        <p className="text-sm opacity-70">
                                            مسئله‌ای انتخاب نشده است.
                                        </p>
                                    </div>
                                )}
                                {activeTab === "video" && (
                                    <VideoCallUi interviewId={interview.id} />
                                )}
                                {activeTab === "chat" && (
                                    <div className="h-full flex flex-col">
                                        {/* Chat messages */}
                                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                            {messages.length === 0 ? (
                                                <div className="h-full flex items-center justify-center">
                                                    <p className="text-sm opacity-70">
                                                        پیامی وجود ندارد.
                                                    </p>
                                                </div>
                                            ) : (
                                                messages.map((msg) => (
                                                    <div
                                                        key={msg.id}
                                                        className={`flex flex-col ${
                                                            msg.senderId === currentUser.id
                                                                ? "items-end"
                                                                : "items-start"
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-xs font-medium opacity-70">
                                                                {msg.sender.fullName}
                                                            </span>
                                                            <span className="text-xs opacity-40">
                                                                {formatTime(msg.createdAt)}
                                                            </span>
                                                        </div>
                                                        <div
                                                            className={`max-w-[70%] rounded-xl px-3 py-2 text-sm ${
                                                                msg.senderId === currentUser.id
                                                                    ? "bg-green-500/20 text-green-100"
                                                                    : "bg-white/10 text-white"
                                                            }`}
                                                        >
                                                            {msg.content}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                            <div ref={chatEndRef} />
                                        </div>

                                        {/* Chat input */}
                                        <form
                                            onSubmit={handleChatSubmit}
                                            className="border-t border-[#2d3139] p-3 flex gap-2"
                                        >
                                            <input
                                                type="text"
                                                value={chatInput}
                                                onChange={(e) => setChatInput(e.target.value)}
                                                placeholder="پیام خود را بنویسید..."
                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-green-500/50"
                                            />
                                            <Button
                                                type="submit"
                                                size="sm"
                                                disabled={!chatInput.trim()}
                                                icon={<Send className="size-4" />}
                                            >
                                                ارسال
                                            </Button>
                                        </form>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Interview;
