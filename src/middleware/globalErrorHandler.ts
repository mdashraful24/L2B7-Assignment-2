import type { NextFunction, Request, Response } from "express";
import { errorHandle } from "../utils/errorResponse";

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const { message, statusCode } = errorHandle(err);

    res.status(statusCode ?? 500).json({
        success: false,
        message,
    });
}

export default globalErrorHandler;