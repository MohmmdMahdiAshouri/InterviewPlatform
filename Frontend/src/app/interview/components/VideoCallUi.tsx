"use client";
import {
    Call,
    CallControls,
    SpeakerLayout,
    StreamCall,
    StreamVideo,
    StreamVideoClient,
} from "@stream-io/video-react-sdk";
import {
    Loader2Icon,
    MessageSquareIcon,
    TruckElectricIcon,
    UsersIcon,
    XIcon,
} from "lucide-react";

import "@stream-io/video-react-sdk/dist/css/styles.css";

function VideoCallUi() {
    if (true) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
                    <p className="text-lg">Joining call...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex gap-3 relative str-video">
            <div className="flex-1 flex flex-col gap-3">
                {/* Participants count badge and Chat Toggle */}
                <div className="flex items-center justify-between gap-2 bg-base-100 p-3 rounded-lg shadow">
                    <div className="flex items-center gap-2">
                        <UsersIcon className="w-5 h-5 text-primary" />
                        <span className="font-semibold">
                            {/* {participantCount}{" "}
                            {participantCount === 1 */}
                            ? participant : participants
                        </span>
                    </div>
                    {true && true && (
                        <button
                            // onClick={() => setIsChatOpen(!isChatOpen)}
                            className={`btn btn-sm gap-2`}
                            // title={isChatOpen ? "Hide chat" : "Show chat"}
                        >
                            <MessageSquareIcon className="size-4" />
                            Chat
                        </button>
                    )}
                </div>

                <div className="flex-1 bg-base-300 rounded-lg overflow-hidden relative">
                    <SpeakerLayout />
                </div>

                <div className="bg-base-100 p-3 rounded-lg shadow flex justify-center">
                    <CallControls />
                </div>
            </div>

            {/* CHAT SECTION */}

            {true && true && (
                <div
                    className={`flex flex-col rounded-lg shadow overflow-hidden bg-[#272a30] transition-all duration-300 ease-in-out ${
                        true ? "w-80 opacity-100" : "w-0 opacity-0"
                    }`}
                >
                    {true && (
                        <>
                            <div className="bg-[#1c1e22] p-3 border-b border-[#3a3d44] flex items-center justify-between">
                                <h3 className="font-semibold text-white">
                                    Session Chat
                                </h3>
                                <button
                                    // onClick={() => setIsChatOpen(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                    title="Close chat"
                                >
                                    <XIcon className="size-5" />
                                </button>
                            </div>
                            
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
export default VideoCallUi;
