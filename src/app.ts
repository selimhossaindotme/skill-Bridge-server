import express, { type Application, type Request, type Response } from "express";
import cors from "cors";
import { envVars } from "./config";
import router from "./app/routes";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";

const app : Application = express();

app.use(cors({
    origin: envVars.appUrl,
    credentials: true,
}))

app.use(express.json());
app.all('/api/auth/{*any}', toNodeHandler(auth));

// routes
app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World");

})

export default app;