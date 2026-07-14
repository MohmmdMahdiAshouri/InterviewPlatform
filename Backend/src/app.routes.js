import { Router } from "express";
import { authRoute } from "./modules/auth/auth.routes.js";
import { roleRequestRoute } from "./modules/role-request/role-request.routes.js";
import { problemRoute } from "./modules/problem/problem.routes.js";
import { interviewRoute } from "./modules/interview/interview.routes.js";

export const mainRoutes = Router();

mainRoutes.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

mainRoutes.use("/auth", authRoute)

mainRoutes.use("/role-requests", roleRequestRoute)

mainRoutes.use("/problems", problemRoute)

mainRoutes.use("/interviews", interviewRoute)