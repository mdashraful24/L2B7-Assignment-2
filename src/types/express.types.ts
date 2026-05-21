import type { Request, Response } from "express";

export type TypeController = (
    req: Request,
    res: Response
) => Promise<void>


export const USER_ROLE = {
    contributor: "contributor",
    maintainer: "maintainer"
} as const


export type ROLES = "contributor" | "maintainer"


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