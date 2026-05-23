import express, { type Application, type Request, type Response } from "express";
import { sendResponse } from "./utils/sendResponse";
import { authRoute } from "./modules/auth/auth.route";
import { issuesRoute } from "./modules/issues/issue.route";
import globalErrorHandler from "./middleware/globalErrorHandler";
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
        author: "Ashraful Islam Ratul"
    });
})

app.use("/api/auth", authRoute);
app.use("/api/issues", issuesRoute);

// Global Error Handling Middleware
app.use(globalErrorHandler);

export default app;