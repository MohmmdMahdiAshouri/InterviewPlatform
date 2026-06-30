import express from "express";
import { config } from "dotenv";
import { cors } from "cors";
import cookieParser from "cookie-parser";
import { router } from "./src/app.routes";
import { notFoundHandler } from "./src/common/exception/not-found.handler";
import { allExceptionHandler } from "./src/common/exception/all-exception.handler";
config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(router)

app.use(notFoundHandler)
app.use(allExceptionHandler)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})