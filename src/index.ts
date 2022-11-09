import "./db";

import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";

// route imports
import { userRouter } from './routes'
import { NODE_ENV } from "./constants";

// init
const app = express();
const port = process.env.PORT || 5000;

// initialize middleware
app.use(helmet()); // for security
app.use(cors()); // accept cors agreement

if (process.env.NODE_ENV == NODE_ENV.dev)
    app.use(morgan("dev")); // useful in development

app.use(express.json()); // bodyparser
app.use(express.urlencoded({ extended: false }));
app.use(compression()); // allow our client requests to be compressed

// routes
app.use("/users", userRouter);

app.get("/", (req, res) => {
    res.send("Welcome to the api");
});

app.listen(port, () => {
    console.clear()
    console.log('\x1b[32m%s\x1b[0m', `Bulb chat API is Connected on port ${port}`)
})
