"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useAuthStore } from "@/src/stores/auth.store";
import { createInterviewSocket } from "@/src/libs/socket";
import type { ChatMessage } from "@/src/types/interview.type";
import type { Socket } from "socket.io-client";

interface UseInterviewSocketReturn {
    messages: ChatMessage[];
    connectionError: string | null;
    sendMessage: (content: string) => void;
    emitCodeUpdate: (problemId: string, code: string) => void;
    onCodeUpdate: (callback: (data: { problemId: string; code: string; senderId: string }) => void) => () => void;
}

export function useInterviewSocket(interviewId: string): UseInterviewSocketReturn {
    const accessToken = useAuthStore((s) => s.accessToken);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const codeUpdateCallbacksRef = useRef<Set<(data: { problemId: string; code: string; senderId: string }) => void>>(new Set());
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!accessToken || !interviewId) return;

        const socket = createInterviewSocket(accessToken);
        socketRef.current = socket;

        socket.on("connect", () => {
            setConnectionError(null);
            socket.emit("interview:join", { interviewId });
        });

        socket.on("interview:joined", ({ messages: history, codeState }) => {
            setMessages(history);
            // codeState is available for late-joiner catch-up if needed
        });

        socket.on("chat:message", (message: ChatMessage) => {
            setMessages((prev) => [...prev, message]);
        });

        socket.on("code:update", (data: { problemId: string; code: string; senderId: string }) => {
            // Notify all registered callbacks
            codeUpdateCallbacksRef.current.forEach((cb) => cb(data));
        });

        socket.on("interview:error", ({ message }: { message: string }) => {
            setConnectionError(message);
        });

        socket.on("connect_error", () => {
            setConnectionError("خطا در اتصال به سرور");
        });

        socket.connect();

        return () => {
            socket.removeAllListeners();
            socket.disconnect();
            socketRef.current = null;
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [accessToken, interviewId]);

    const sendMessage = useCallback((content: string) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit("chat:message", { interviewId, content });
        }
    }, [interviewId]);

    const emitCodeUpdate = useCallback((problemId: string, code: string) => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
            if (socketRef.current?.connected) {
                socketRef.current.emit("code:update", { interviewId, problemId, code });
            }
        }, 400);
    }, [interviewId]);

    const onCodeUpdate = useCallback((callback: (data: { problemId: string; code: string; senderId: string }) => void) => {
        codeUpdateCallbacksRef.current.add(callback);
        return () => {
            codeUpdateCallbacksRef.current.delete(callback);
        };
    }, []);

    return {
        messages,
        connectionError,
        sendMessage,
        emitCodeUpdate,
        onCodeUpdate,
    };
}
