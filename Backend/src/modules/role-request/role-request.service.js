import { prisma } from "../../configs/prisma.js";
import createHttpError from "http-errors";

export async function createRoleRequestService({ userId, role }) {
    if (role !== "USER") {
        throw createHttpError(400, "شما دسترسی لازم را دارید");
    }

    const existingPending = await prisma.roleRequest.findFirst({
        where: {
            userId,
            status: "PENDING",
        },
    });

    if (existingPending) {
        throw createHttpError(400, "شما هنوز یک درخواست در جریان دارید");
    }

    const roleRequest = await prisma.roleRequest.create({
        data: {
            userId,
        },
    });

    return roleRequest;
}

export async function listRoleRequestsService({ status }) {
    const where = status ? { status } : {};

    const roleRequests = await prisma.roleRequest.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
            user: {
                select: {
                    id: true,
                    fullName: true,
                    phone: true,
                    role: true,
                },
            },
        },
    });

    return roleRequests;
}

export async function getMyRoleRequestService({ userId }) {
    const latestRequest = await prisma.roleRequest.findFirst({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    
    return latestRequest;
}

export async function approveRoleRequestService({ roleRequestId, reviewerId }) {
    const roleRequest = await prisma.roleRequest.findUnique({
        where: { id: roleRequestId },
    });

    if (!roleRequest) {
        throw createHttpError(404, "درخواستی برای تغییر دسترسی پیدا نشد");
    }

    if (roleRequest.status !== "PENDING") {
        throw createHttpError(400, "این درخواست قبلا بررسی شده");
    }

    const updatedRequest = await prisma.$transaction(async (tx) => {
        const updated = await tx.roleRequest.update({
            where: { id: roleRequestId },
            data: {
                status: "APPROVED",
                reviewedBy: reviewerId,
                reviewedAt: new Date(),
            },
        });

        await tx.user.update({
            where: { id: roleRequest.userId },
            data: { role: "INTERVIEWER" },
        });

        return updated;
    });

    return updatedRequest;
}

export async function rejectRoleRequestService({ roleRequestId, reviewerId }) {
    const roleRequest = await prisma.roleRequest.findUnique({
        where: { id: roleRequestId },
    });

    if (!roleRequest) {
        throw createHttpError(404, "درخواستی برای تغییر دسترسی پیدا نشد");
    }

    if (roleRequest.status !== "PENDING") {
        throw createHttpError(400, "این درخواست قبلا بررسی شده");
    }

    const updatedRequest = await prisma.roleRequest.update({
        where: { id: roleRequestId },
        data: {
            status: "REJECTED",
            reviewedBy: reviewerId,
            reviewedAt: new Date(),
        },
    });

    return updatedRequest;
}
