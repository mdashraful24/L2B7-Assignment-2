import express, { type Application, type Request, type Response } from "express";
import { sendResponse } from "./utils/sendResponse";
const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    // res.send('DevPulse Project!')

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "DevPulse Project!",
        author: "AIR"
    });
})

// app.use("/api/users");

export default app;