import { prisma } from "../../configs/prisma.js";
import createHttpError from "http-errors";
import crypto from "crypto";
import { StreamClient } from "@stream-io/node-sdk";

export function generateRoomCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(crypto.randomInt(chars.length));
    }
    return code;
}

export async function checkInterviewAccess({ interviewId, userId }) {
    const interview = await prisma.interview.findUnique({
        where: { id: interviewId },
        include: {
            participants: { select: { userId: true } },
        },
    });

    if (!interview) {
        throw createHttpError(404, "مصاحبه یافت نشد");
    }

    const isHost = interview.hostId === userId;
    const isParticipant = interview.participants.some(
        (p) => p.userId === userId
    );

    if (!isHost && !isParticipant) {
        throw createHttpError(403, "شما به این مصاحبه دسترسی ندارید");
    }

    return { interview, isHost, isParticipant };
}

export async function createInterviewService({ hostId, title, problemIds }) {
    // Validate all problems exist and are accessible (owner or public)
    const problems = await prisma.problem.findMany({
        where: { id: { in: problemIds } },
    });

    if (problems.length !== problemIds.length) {
        throw createHttpError(400, "یک یا چند مسئله یافت نشد");
    }

    for (const problem of problems) {
        if (problem.ownerId !== hostId && problem.visibility !== "PUBLIC") {
            throw createHttpError(
                400,
                "فقط می‌توانید مسائل خود یا مسائل عمومی را ضمیمه کنید"
            );
        }
    }

    // Generate unique roomCode
    let roomCode;
    let isUnique = false;
    while (!isUnique) {
        roomCode = generateRoomCode();
        const existing = await prisma.interview.findUnique({
            where: { roomCode },
        });
        if (!existing) isUnique = true;
    }

    const interview = await prisma.$transaction(async (tx) => {
        const created = await tx.interview.create({
            data: {
                hostId,
                title,
                roomCode,
                status: "SCHEDULED",
            },
        });

        // Host is automatically a participant
        await tx.interviewParticipant.create({
            data: {
                interviewId: created.id,
                userId: hostId,
            },
        });

        // Create InterviewProblem rows with order
        const interviewProblems = problemIds.map((problemId, index) => ({
            interviewId: created.id,
            problemId,
            order: index,
        }));

        await tx.interviewProblem.createMany({
            data: interviewProblems,
        });

        // Return full interview with relations
        return tx.interview.findUnique({
            where: { id: created.id },
            include: {
                host: { select: { id: true, fullName: true } },
                problems: {
                    orderBy: { order: "asc" },
                    include: {
                        problem: {
                            select: {
                                id: true,
                                title: true,
                                difficulty: true,
                                category: true,
                                description: true,
                                starterCode: true,
                                examples: true,
                                constraints: true,
                            },
                        },
                    },
                },
                participants: {
                    include: {
                        user: { select: { id: true, fullName: true } },
                    },
                },
            },
        });
    });

    return interview;
}

export async function joinInterviewService({ roomCode, userId }) {
    const interview = await prisma.interview.findUnique({
        where: { roomCode },
    });

    if (!interview) {
        throw createHttpError(404, "اتاق یافت نشد");
    }

    if (interview.status === "ENDED") {
        throw createHttpError(400, "این مصاحبه به پایان رسیده است");
    }

    // Upsert participant (no-op if already joined)
    await prisma.interviewParticipant.upsert({
        where: {
            interviewId_userId: {
                interviewId: interview.id,
                userId,
            },
        },
        update: {},
        create: {
            interviewId: interview.id,
            userId,
        },
    });

    return { id: interview.id };
}

export async function getInterviewByIdService({ id, userId }) {
    const { interview, isHost } = await checkInterviewAccess({
        interviewId: id,
        userId,
    });

    // Fetch full interview with relations
    const fullInterview = await prisma.interview.findUnique({
        where: { id },
        include: {
            host: { select: { id: true, fullName: true } },
            problems: {
                orderBy: { order: "asc" },
                include: {
                    problem: {
                        select: {
                            id: true,
                            title: true,
                            difficulty: true,
                            category: true,
                            description: true,
                            starterCode: true,
                            examples: true,
                            constraints: true,
                        },
                    },
                },
            },
            participants: {
                include: {
                    user: { select: { id: true, fullName: true } },
                },
            },
        },
    });

    // Only include roomCode for the host
    const result = fullInterview.toJSON ? fullInterview.toJSON() : { ...fullInterview };
    if (!isHost) {
        delete result.roomCode;
    }

    return result;
}

export async function listMyInterviewsService({ userId }) {
    const interviews = await prisma.interview.findMany({
        where: {
            OR: [
                { hostId: userId },
                { participants: { some: { userId } } },
            ],
        },
        orderBy: { createdAt: "desc" },
        include: {
            host: { select: { id: true, fullName: true } },
            _count: { select: { problems: true } },
        },
    });

    return interviews.map((interview) => ({
        id: interview.id,
        title: interview.title,
        status: interview.status,
        createdAt: interview.createdAt,
        host: interview.host,
        problemsCount: interview._count.problems,
    }));
}

export async function updateInterviewProblemsService({
    interviewId,
    userId,
    problemIds,
}) {
    const interview = await prisma.interview.findUnique({
        where: { id: interviewId },
    });

    if (!interview) {
        throw createHttpError(404, "مصاحبه یافت نشد");
    }

    if (interview.hostId !== userId) {
        throw createHttpError(403, "فقط میزبان می‌تواند مسائل را تغییر دهد");
    }

    // Validate all problems
    const problems = await prisma.problem.findMany({
        where: { id: { in: problemIds } },
    });

    if (problems.length !== problemIds.length) {
        throw createHttpError(400, "یک یا چند مسئله یافت نشد");
    }

    for (const problem of problems) {
        if (problem.ownerId !== userId && problem.visibility !== "PUBLIC") {
            throw createHttpError(
                400,
                "فقط می‌توانید مسائل خود یا مسائل عمومی را ضمیمه کنید"
            );
        }
    }

    await prisma.$transaction(async (tx) => {
        // Delete existing InterviewProblem rows
        await tx.interviewProblem.deleteMany({
            where: { interviewId },
        });

        // Recreate from submitted problemIds
        const data = problemIds.map((problemId, index) => ({
            interviewId,
            problemId,
            order: index,
        }));

        await tx.interviewProblem.createMany({ data });
    });

    return { message: "مسائل مصاحبه به‌روزرسانی شد" };
}

export async function updateInterviewStatusService({
    interviewId,
    userId,
    status,
}) {
    const interview = await prisma.interview.findUnique({
        where: { id: interviewId },
    });

    if (!interview) {
        throw createHttpError(404, "مصاحبه یافت نشد");
    }

    if (interview.hostId !== userId) {
        throw createHttpError(
            403,
            "فقط میزبان می‌تواند وضعیت مصاحبه را تغییر دهد"
        );
    }

    const updated = await prisma.interview.update({
        where: { id: interviewId },
        data: { status },
    });

    return updated;
}

export async function getVideoTokenService({ interviewId, userId }) {
    const { interview } = await checkInterviewAccess({
        interviewId,
        userId,
    });

    // Fetch user info for GetStream
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, fullName: true },
    });

    if (!user) {
        throw createHttpError(404, "کاربر یافت نشد");
    }

    const streamClient = new StreamClient(
        process.env.STREAM_API_KEY,
        process.env.STREAM_API_SECRET
    );

    // Upsert user in GetStream
    await streamClient.upsertUsers([
        {
            id: user.id,
            name: user.fullName,
            role: "user",
        },
    ]);

    // Generate token (valid for 24 hours)
    const token = streamClient.generateUserToken({
        user_id: user.id,
        validity_in_seconds: 60 * 60 * 24,
    });

    return {
        apiKey: process.env.STREAM_API_KEY,
        token,
        callId: interviewId,
        userId: user.id,
    };
}
