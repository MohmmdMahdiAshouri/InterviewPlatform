import { Router } from "express";
import { AuthGuard } from "../auth/auth.guard.js";
import { RoleGuard } from "../../common/middleware/role.guard.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import {
    createProblemSchema,
    updateProblemSchema,
    listPublicProblemsSchema,
    listMyProblemsSchema,
    problemIdParamSchema,
} from "./problem.schema.js";
import {
    createProblemHandler,
    listPublicProblemsHandler,
    listMyProblemsHandler,
    getProblemByIdHandler,
    updateProblemHandler,
    deleteProblemHandler,
} from "./problem.controller.js";

export const problemRoute = Router();

problemRoute.get(
    "/public",
    validate(listPublicProblemsSchema, "query"),
    listPublicProblemsHandler
);

problemRoute.get(
    "/mine",
    AuthGuard,
    validate(listMyProblemsSchema, "query"),
    listMyProblemsHandler
);

problemRoute.post(
    "/",
    AuthGuard,
    RoleGuard("INTERVIEWER", "ADMIN"),
    validate(createProblemSchema, "body"),
    createProblemHandler
);

problemRoute.get(
    "/:id",
    AuthGuard,
    validate(problemIdParamSchema, "params"),
    getProblemByIdHandler
);

problemRoute.patch(
    "/:id",
    AuthGuard,
    validate(problemIdParamSchema, "params"),
    validate(updateProblemSchema, "body"),
    updateProblemHandler
);

problemRoute.delete(
    "/:id",
    AuthGuard,
    validate(problemIdParamSchema, "params"),
    deleteProblemHandler
);
