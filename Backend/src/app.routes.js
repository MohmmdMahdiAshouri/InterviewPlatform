import { Router } from "express";
import { authRoute } from "./modules/auth/auth.routes.js";

export const mainRoutes = Router();

mainRoutes.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

mainRoutes.use("/auth", authRoute)