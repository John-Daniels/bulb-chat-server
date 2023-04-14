import "./db";

import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";

// route imports
import { messageRouter, userRouter } from "./routes";
import { NODE_ENV } from "./constants";
import allowedOrigins from "./constants/cors.constant";

// init
const app = express();

// initialize middleware
app.use(helmet());
app.use(
        cors({
                origin: allowedOrigins,
        })
);

if (process.env.NODE_ENV == NODE_ENV.dev) app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());

// routes
app.use("/users", userRouter);
app.use("/messages", messageRouter);

app.get("/", (req, res) => {
        res.send("Welcome to the api");
});

export default app;
