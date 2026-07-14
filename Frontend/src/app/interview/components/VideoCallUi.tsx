"use client";
import { useEffect, useState } from "react";
import {
    CallControls,
    SpeakerLayout,
    StreamCall,
    StreamTheme,
    StreamVideo,
    StreamVideoClient,
} from "@stream-io/video-react-sdk";
import { useVideoToken } from "@/src/hooks/useInterviewVideo";
import { useCheckLogin } from "@/src/hooks/useAuth";
import { Skeleton } from "@/src/components/Ui/Skeleton";

import "@stream-io/video-react-sdk/dist/css/styles.css";

interface VideoCallUiProps {
    interviewId: string;
}

function VideoCallUi({ interviewId }: VideoCallUiProps) {
    const [client, setClient] = useState<StreamVideoClient | null>(null);
    const [call, setCall] = useState<ReturnType<StreamVideoClient["call"]> | null>(null);

    const { data: tokenData, isPending: tokenLoading, error: tokenError } = useVideoToken(interviewId);
    const { data: user } = useCheckLogin();

    // Create client and join call when token is available
    useEffect(() => {
        if (!tokenData || !user) return;

        const videoClient = new StreamVideoClient({
            apiKey: tokenData.apiKey,
            user: {
                id: tokenData.userId,
                name: user.fullName,
            },
            token: tokenData.token,
        });

        setClient(videoClient);

        const defaultCall = videoClient.call("default", tokenData.callId);
        defaultCall.join({ create: true }).catch(console.error);
        setCall(defaultCall);

        return () => {
            defaultCall.leave().catch(console.error);
            videoClient.disconnectUser().catch(console.error);
            setClient(null);
            setCall(null);
        };
    }, [tokenData, user]);

    // Loading state
    if (tokenLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Skeleton className="w-48 h-8 mx-auto" />
                    <p className="text-sm opacity-70">در حال اتصال به تماس ویدیویی...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (tokenError || !tokenData) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold">خطا در اتصال</h2>
                    <p className="text-sm opacity-70">
                        امکان اتصال به تماس ویدیویی وجود ندارد.
                    </p>
                </div>
            </div>
        );
    }

    // Waiting for client/call to be ready
    if (!client || !call) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <Skeleton className="w-32 h-32 rounded-full mx-auto mb-4" />
                    <p className="text-sm opacity-70">در حال آماده‌سازی تماس...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full str-video">
            <StreamVideo client={client}>
                <StreamCall call={call}>
                    <StreamTheme>
                        <div className="h-full flex flex-col">
                            <div className="flex-1 overflow-hidden">
                                <SpeakerLayout participantBarPosition="right" />
                            </div>
                            <div className="border-t border-[#2d3139] p-3 flex justify-center">
                                <CallControls />
                            </div>
                        </div>
                    </StreamTheme>
                </StreamCall>
            </StreamVideo>
        </div>
    );
}

export default VideoCallUi;
