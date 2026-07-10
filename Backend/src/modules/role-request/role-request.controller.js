import {
    approveRoleRequestService,
    createRoleRequestService,
    getMyRoleRequestService,
    listRoleRequestsService,
    rejectRoleRequestService,
} from "./role-request.service.js";

export async function createRoleRequestHandler(req, res, next) {
    try {
        const roleRequest = await createRoleRequestService({
            userId: req.user.id,
            role: req.user.role,
        });

        return res.status(201).json(roleRequest);
    } catch (error) {
        next(error);
    }
}

export async function listRoleRequestsHandler(req, res, next) {
    try {
        const { status } = req.query;

        const roleRequests = await listRoleRequestsService({status});

        return res.json(roleRequests);
    } catch (error) {
        next(error);
    }
}

export async function getMyRoleRequestHandler(req, res, next) {
    try {
        const userId = req.user.id

        const roleRequests = await getMyRoleRequestService({userId})

        return res.json(roleRequests)
    } catch (error) {
        next(error)
    }
}

export async function approveRoleRequestHandler(req, res, next) {
    try {
        const updatedRequest = await approveRoleRequestService({
            roleRequestId: req.params.id,
            reviewerId: req.user.id,
        });

        return res.json(updatedRequest);
    } catch (error) {
        next(error);
    }
}

export async function rejectRoleRequestHandler(req, res, next) {
    try {
        const { id } = req.params;

        const updatedRequest = await rejectRoleRequestService({
            roleRequestId: req.params.id,
            reviewerId: req.user.id,
        });

        return res.json(updatedRequest);
    } catch (error) {
        next(error);
    }
}
