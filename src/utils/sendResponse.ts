import type { Response } from "express";

type IResponse<T, E> = {
    statusCode: number;
    success: boolean;
    message?: string;
    data?: T;
    error?: E;
    author?: string;
}

export const sendResponse = <T, E>(res: Response, resData: IResponse<T, E>) => {
    res.status(resData.statusCode).json({
        success: resData.success,
        message: resData.message,
        data: resData.data,
        error: resData.error,
        author: resData.author,
    })
}


export const normalizeError = (error: unknown): Error => {
    if (error instanceof Error) return error;
    return new Error("Something went wrong");
};


// let message = "Something went wrong"

//         if (error instanceof Error) {
//             message = error.message
//         }

//         sendResponse(res, {
//             statusCode: 500,
//             success: false,
//             message,
//             error,
//         })