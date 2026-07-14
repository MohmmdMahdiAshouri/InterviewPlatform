import { Router } from "express";
import { AuthGuard } from "../auth/auth.guard.js";
import { RoleGuard } from "../../common/middleware/role.guard.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import {
    createInterviewSchema,
    joinInterviewSchema,
    updateInterviewProblemsSchema,
    updateInterviewStatusSchema,
    interviewIdParamSchema,
} from "./interview.schema.js";
import {
    createInterviewHandler,
    joinInterviewHandler,
    getInterviewByIdHandler,
    listMyInterviewsHandler,
    updateInterviewProblemsHandler,
    updateInterviewStatusHandler,
    getVideoTokenHandler,
} from "./interview.controller.js";

export const interviewRoute = Router();

interviewRoute.post(
    "/",
    AuthGuard,
    RoleGuard("INTERVIEWER", "ADMIN"),
    validate(createInterviewSchema, "body"),
    createInterviewHandler
);

interviewRoute.post(
    "/join",
    AuthGuard,
    validate(joinInterviewSchema, "body"),
    joinInterviewHandler
);

interviewRoute.get("/mine", AuthGuard, listMyInterviewsHandler);

interviewRoute.get(
    "/:id",
    AuthGuard,
    validate(interviewIdParamSchema, "params"),
    getInterviewByIdHandler
);

interviewRoute.patch(
    "/:id/problems",
    AuthGuard,
    validate(interviewIdParamSchema, "params"),
    validate(updateInterviewProblemsSchema, "body"),
    updateInterviewProblemsHandler
);

interviewRoute.patch(
    "/:id/status",
    AuthGuard,
    validate(interviewIdParamSchema, "params"),
    validate(updateInterviewStatusSchema, "body"),
    updateInterviewStatusHandler
);

interviewRoute.get(
    "/:id/video-token",
    AuthGuard,
    validate(interviewIdParamSchema, "params"),
    getVideoTokenHandler
);
