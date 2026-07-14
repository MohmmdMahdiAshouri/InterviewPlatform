import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { prisma } from "../configs/prisma.js";
import { checkInterviewAccess } from "../modules/interview/interview.service.js";

// In-memory code state for late-joiner catch-up (ephemeral, not persisted)
const codeState = new Map();

export function initSocketServer(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:3000",
            credentials: true,
        },
    });

    // Authentication middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error("unauthorized"));
            }

            const verified = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

            if (!verified?.userId) {
                return next(new Error("unauthorized"));
            }

            const user = await prisma.user.findUnique({
                where: { id: verified.userId },
                select: { id: true, phone: true, fullName: true, role: true },
            });

            if (!user) {
                return next(new Error("unauthorized"));
            }

            socket.data.user = user;
            next();
        } catch (error) {
            next(new Error("unauthorized"));
        }
    });

    io.on("connection", (socket) => {
        const user = socket.data.user;
        console.log(`Socket connected: ${user.fullName} (${user.id})`);

        // Track which interviews this socket has joined
        const joinedInterviews = new Set();

        // Handle interview room join
        socket.on("interview:join", async ({ interviewId }) => {
            try {
                const { interview } = await checkInterviewAccess({
                    interviewId,
                    userId: user.id,
                });

                socket.join(`interview:${interviewId}`);
                joinedInterviews.add(interviewId);

                // Fetch last 50 chat messages
                const messages = await prisma.chatMessage.findMany({
                    where: { interviewId },
                    orderBy: { createdAt: "asc" },
                    take: 50,
                    include: {
                        sender: { select: { fullName: true } },
                    },
                });

                // Get current code state for all problems in this interview
                const currentCodeState = {};
                const interviewProblems = await prisma.interviewProblem.findMany({
                    where: { interviewId },
                    select: { problemId: true },
                });

                for (const { problemId } of interviewProblems) {
                    const key = `${interviewId}:${problemId}`;
                    if (codeState.has(key)) {
                        currentCodeState[problemId] = codeState.get(key);
                    }
                }

                socket.emit("interview:joined", {
                    messages,
                    codeState: currentCodeState,
                });
            } catch (error) {
                socket.emit("interview:error", {
                    message: error.message || "دسترسی غیرمجاز",
                });
            }
        });

        // Handle chat message
        socket.on("chat:message", async ({ interviewId, content }) => {
            try {
                // Verify room membership
                if (!joinedInterviews.has(interviewId)) {
                    return socket.emit("interview:error", {
                        message: "ابتدا وارد اتاق شوید",
                    });
                }

                // Validate content
                if (!content || typeof content !== "string" || content.trim().length === 0) {
                    return socket.emit("interview:error", {
                        message: "محتوای پیام خالی است",
                    });
                }

                if (content.length > 2000) {
                    return socket.emit("interview:error", {
                        message: "پیام بیش از حد طولانی است",
                    });
                }

                // Persist message
                const message = await prisma.chatMessage.create({
                    data: {
                        interviewId,
                        senderId: user.id,
                        content: content.trim(),
                    },
                    include: {
                        sender: { select: { fullName: true } },
                    },
                });

                // Broadcast to room (including sender for consistent UX)
                io.to(`interview:${interviewId}`).emit("chat:message", {
                    id: message.id,
                    interviewId: message.interviewId,
                    senderId: message.senderId,
                    content: message.content,
                    createdAt: message.createdAt,
                    sender: message.sender,
                });
            } catch (error) {
                socket.emit("interview:error", {
                    message: "خطا در ارسال پیام",
                });
            }
        });

        // Handle live code update
        socket.on("code:update", ({ interviewId, problemId, code }) => {
            try {
                // Verify room membership
                if (!joinedInterviews.has(interviewId)) {
                    return;
                }

                // Store in memory for late-joiner catch-up
                const key = `${interviewId}:${problemId}`;
                codeState.set(key, code);

                // Broadcast to others in the room (NOT to sender)
                socket.to(`interview:${interviewId}`).emit("code:update", {
                    problemId,
                    code,
                    senderId: user.id,
                });
            } catch (error) {
                // Silent fail for code updates — non-critical
            }
        });

        // Handle disconnect
        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${user.fullName} (${user.id})`);
            // Socket.io automatically leaves all rooms on disconnect
            // No special cleanup needed
        });
    });

    return io;
}
