import { io, Socket } from "socket.io-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function createInterviewSocket(accessToken: string): Socket {
    return io(API_BASE_URL, {
        auth: { token: accessToken },
        autoConnect: false,
        transports: ["websocket", "polling"],
    });
}
