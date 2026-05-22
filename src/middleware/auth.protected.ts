import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { ROLES } from "../types/express.types";
import config from "../config";
import { pool } from "../db";
import { SelfError } from "../utils/errorResponse";

const protectedAuth = (...roles: ROLES[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization

            if (!token) {
                throw new SelfError("Unauthorized access!", 401)
            }

            const decoded = jwt.verify(token as string, config.access_secret) as JwtPayload

            const userData = await pool.query(`
                SELECT * FROM users WHERE email=$1
                `, [decoded.email]
            )

            const user = userData.rows[0]

            if (userData.rows.length === 0) {
                throw new SelfError("User not found!", 404)
            }

            if (roles.length && !roles.includes(user.role)) {
                throw new SelfError("Forbidden!", 403)
            }

            req.user = decoded

            next()
        } catch (error) {
            next(error)
        }
    }
}

export default protectedAuth