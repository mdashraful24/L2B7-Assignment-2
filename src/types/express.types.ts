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