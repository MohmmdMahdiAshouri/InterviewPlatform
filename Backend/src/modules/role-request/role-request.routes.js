import { Router } from "express";
import { AuthGuard } from "../auth/auth.guard.js";
import { RoleGuard } from "../../common/middleware/role.guard.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import {
    listRoleRequestsSchema,
    roleRequestIdParamSchema,
} from "./role-request.schema.js";
import {
    approveRoleRequestHandler,
    createRoleRequestHandler,
    getMyRoleRequestHandler,
    listRoleRequestsHandler,
    rejectRoleRequestHandler,
} from "./role-request.controller.js";

export const roleRequestRoute = Router();

roleRequestRoute.post("/", AuthGuard, createRoleRequestHandler);

roleRequestRoute.get(
    "/",
    AuthGuard,
    RoleGuard("ADMIN"),
    validate(listRoleRequestsSchema, "query"),
    listRoleRequestsHandler,
);
roleRequestRoute.get("/me", AuthGuard, getMyRoleRequestHandler);
roleRequestRoute.patch(
    "/:id/approve",
    AuthGuard,
    RoleGuard("ADMIN"),
    validate(roleRequestIdParamSchema, "params"),
    approveRoleRequestHandler
);
roleRequestRoute.patch(
    "/:id/reject",
    AuthGuard,
    RoleGuard("ADMIN"),
    validate(roleRequestIdParamSchema, "params"),
    rejectRoleRequestHandler
);
