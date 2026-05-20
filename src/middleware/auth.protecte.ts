import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { ROLES } from "../types/express.types";
import { sendResponse } from "../utils/sendResponse";
import config from "../config";
import { pool } from "../db";

const protectedAuth = (...roles: ROLES[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization

            if (!token) {
                sendResponse(res, {
                    statusCode: 401,
                    success: false,
                    message: "Unauthorized access!"
                })
                return
            }

            const decoded = jwt.verify(token as string, config.access_secret) as JwtPayload

            const userData = await pool.query(`
                SELECT * FROM users WHERE email=$1
                `, [decoded.email]
            )

            const user = userData.rows[0]

            if (userData.rows.length === 0) {
                sendResponse(res, {
                    statusCode: 404,
                    success: false,
                    message: "User not found!"
                })
                return
            }

            if (roles.length && !roles.includes(user.role)) {
                sendResponse(res, {
                    statusCode: 403,
                    success: false,
                    message: "Forbidden!!"
                })
                return
            }

            req.user = decoded

            next()
        } catch (error: any) {
            next(error)
        }
    }
}

export default protectedAuth