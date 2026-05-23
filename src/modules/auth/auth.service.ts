import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import type { IUser } from "./auth.interface"
import { pool } from "../../db"
import config from "../../config"
import { SelfError } from "../../utils/errorResponse"

const registerUserIntoDB = async (payload: IUser) => {
    const { name, email, password, role } = payload

    // Validation
    if (!name) {
        throw new SelfError("Full name is required", 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new SelfError("Invalid email format", 400);
    }

    if (!password) {
        throw new SelfError("Password is required", 400);
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const result = await pool.query(`
            INSERT INTO users (name, email, password, role)
            VALUES ($1, $2, $3, COALESCE($4, 'contributor'))
            RETURNING *
        `, [name, email, hashPassword, role]
    )

    delete result.rows[0].password

    return result
}

const loginUserIntoDB = async (payload: { email: string, password: string }) => {
    const { email, password } = payload

    const userData = await pool.query(`
        SELECT * FROM users WHERE email=$1`
        , [email]
    )

    // User not found
    if (userData.rows.length === 0) {
        throw new SelfError("User does not exist!", 404)
    }

    const user = userData.rows[0]

    // Password check
    const matchPassword = await bcrypt.compare(password, user.password)

    if (!matchPassword) {
        throw new SelfError("Incorrect password!", 401)
    }

    delete user.password

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    const accessToken = jwt.sign(
        jwtPayload,
        config.access_secret,
        { expiresIn: "1d" }
    )

    return {
        token: accessToken,
        user
    }
}

export const authService = {
    registerUserIntoDB,
    loginUserIntoDB,
}