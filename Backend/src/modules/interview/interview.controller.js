import {
    createInterviewService,
    joinInterviewService,
    getInterviewByIdService,
    listMyInterviewsService,
    updateInterviewProblemsService,
    updateInterviewStatusService,
    getVideoTokenService,
} from "./interview.service.js";

export async function createInterviewHandler(req, res, next) {
    try {
        const interview = await createInterviewService({
            hostId: req.user.id,
            title: req.body.title,
            problemIds: req.body.problemIds,
        });

        return res.status(201).json(interview);
    } catch (error) {
        next(error);
    }
}

export async function joinInterviewHandler(req, res, next) {
    try {
        const result = await joinInterviewService({
            roomCode: req.body.roomCode,
            userId: req.user.id,
        });

        return res.json(result);
    } catch (error) {
        next(error);
    }
}

export async function getInterviewByIdHandler(req, res, next) {
    try {
        const interview = await getInterviewByIdService({
            id: req.params.id,
            userId: req.user.id,
        });

        return res.json(interview);
    } catch (error) {
        next(error);
    }
}

export async function listMyInterviewsHandler(req, res, next) {
    try {
        const interviews = await listMyInterviewsService({
            userId: req.user.id,
        });

        return res.json(interviews);
    } catch (error) {
        next(error);
    }
}

export async function updateInterviewProblemsHandler(req, res, next) {
    try {
        const result = await updateInterviewProblemsService({
            interviewId: req.params.id,
            userId: req.user.id,
            problemIds: req.body.problemIds,
        });

        return res.json(result);
    } catch (error) {
        next(error);
    }
}

export async function updateInterviewStatusHandler(req, res, next) {
    try {
        const result = await updateInterviewStatusService({
            interviewId: req.params.id,
            userId: req.user.id,
            status: req.body.status,
        });

        return res.json(result);
    } catch (error) {
        next(error);
    }
}

export async function getVideoTokenHandler(req, res, next) {
    try {
        const result = await getVideoTokenService({
            interviewId: req.params.id,
            userId: req.user.id,
        });

        return res.json(result);
    } catch (error) {
        next(error);
    }
}
