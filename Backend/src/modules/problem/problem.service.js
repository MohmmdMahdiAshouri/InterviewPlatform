import { prisma } from "../../configs/prisma.js";
import createHttpError from "http-errors";

export async function createProblemService({ ownerId, data }) {
    const problem = await prisma.problem.create({
        data: {
            ownerId,
            title: data.title,
            description: data.description,
            category: data.category,
            difficulty: data.difficulty,
            visibility: data.visibility ?? "PRIVATE",
            starterCode: data.starterCode ?? undefined,
            examples: data.examples ?? undefined,
            constraints: data.constraints ?? undefined,
        },
    });

    return problem;
}

export async function listPublicProblemsService({
    category,
    difficulty,
    search,
}) {
    let where = {
        visibility: "PUBLIC",
    };

    if (category) {
        where.category = category;
    }

    if (difficulty) {
        where.difficulty = difficulty;
    }

    if (search) {
        where.title = {
            contains: search,
            mode: "insensitive",
        };
    }

    // const [problems, stats] = await Promise.all([
        const problems = await prisma.problem.findMany({
            where,
            orderBy: { createdAt: "desc" },
        })
        console.log(problems);
        
        // prisma.problem.groupBy({
        //     by: ["difficulty"],
        //     _count: {
        //         difficulty: true,
        //     },
        // }),
    // ]);

    return problems;
}

export async function listMyProblemsService({
    ownerId,
    category,
    difficulty,
    search,
    visibility,
}) {
    const where = {
        ownerId,
    };

    if (category) {
        where.category = category;
    }

    if (difficulty) {
        where.difficulty = difficulty;
    }

    if (search) {
        where.title = {
            contains: search,
            mode: "insensitive",
        };
    }

    if (visibility) {
        where.visibility = visibility;
    }

    const problems = await prisma.problem.findMany({
        where,
        orderBy: { createdAt: "desc" },
    });

    return problems;
}

export async function getProblemByIdService({ id }) {
    const problem = await prisma.problem.findUnique({
        where: { id },
    });

    if (!problem) {
        throw createHttpError(404, "مسئله یافت نشد");
    }

    return problem;
}

export async function updateProblemService({ id, data }) {
    const problem = await prisma.problem.findUnique({
        where: { id },
    });

    if (!problem) {
        throw createHttpError(404, "مسئله یافت نشد");
    }

    const updated = await prisma.problem.update({
        where: { id },
        data,
    });

    return updated;
}

export async function deleteProblemService({ id }) {
    const problem = await prisma.problem.findUnique({
        where: { id },
    });

    if (!problem) {
        throw createHttpError(404, "مسئله یافت نشد");
    }

    await prisma.problem.delete({
        where: { id },
    });

    return { message: "مسئله با موفقیت حذف شد" };
}
