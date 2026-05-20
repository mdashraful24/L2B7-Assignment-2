import type { TypeController } from "../../types/express.types";
import { sendResponse } from "../../utils/sendResponse";
import { authService } from "./auth.service";

const registerUser: TypeController = async (req, res) => {
    try {
        const result = await authService.registerUserIntoDB(req.body)

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "User registered successfully",
            data: result.rows[0],
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error,
        });
    }
}

const loginUser: TypeController = async(req, res) => {
    try {
        const result = await authService.loginUserIntoDB(req.body)

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Login successful",
            data: result,
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error,
        });
    }
}

export const authController = {
    registerUser,
    loginUser,

}