import createHttpError from "http-errors";
import {
    createProblemService,
    listPublicProblemsService,
    listMyProblemsService,
    getProblemByIdService,
    updateProblemService,
    deleteProblemService,
} from "./problem.service.js";

export async function createProblemHandler(req, res, next) {
    try {
        const problem = await createProblemService({
            ownerId: req.user.id,
            data: req.body,
        });

        return res.status(201).json(problem);
    } catch (error) {
        next(error);
    }
}

export async function listPublicProblemsHandler(req, res, next) {
    try {
        const { category, difficulty, search } = req.query;

        const problems = await listPublicProblemsService({
            category,
            difficulty,
            search,
        });

        return res.json(problems);
    } catch (error) {
        next(error);
    }
}

export async function listMyProblemsHandler(req, res, next) {
    try {
        const { category, difficulty, search, visibility } = req.query;

        const problems = await listMyProblemsService({
            ownerId: req.user.id,
            category,
            difficulty,
            search,
            visibility,
        });

        return res.json(problems);
    } catch (error) {
        next(error);
    }
}

export async function getProblemByIdHandler(req, res, next) {
    try {
        const problem = await getProblemByIdService({ id: req.params.id });

        if (problem.visibility === "PUBLIC") {
            return res.json(problem);
        }

        if (problem.ownerId !== req.user.id) {
            throw createHttpError(403, "شما به این مسئله دسترسی ندارید");
        }

        return res.json(problem);
    } catch (error) {
        next(error);
    }
}

export async function updateProblemHandler(req, res, next) {
    try {
        const problem = await getProblemByIdService({ id: req.params.id });

        if (problem.ownerId !== req.user.id) {
            throw createHttpError(403, "شما فقط می‌توانید مسائل خود را ویرایش کنید");
        }

        const updated = await updateProblemService({
            id: req.params.id,
            data: req.body,
        });

        return res.json(updated);
    } catch (error) {
        next(error);
    }
}

export async function deleteProblemHandler(req, res, next) {
    try {
        const problem = await getProblemByIdService({ id: req.params.id });

        if (problem.ownerId !== req.user.id) {
            throw createHttpError(403, "شما فقط می‌توانید مسائل خود را حذف کنید");
        }

        const result = await deleteProblemService({ id: req.params.id });

        return res.json(result);
    } catch (error) {
        next(error);
    }
}
