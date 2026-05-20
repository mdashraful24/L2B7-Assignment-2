import type { TypeController } from "../../types/express.types";
import { sendResponse } from "../../utils/sendResponse";
import { issuesService } from "./issue.service";

const createIssue: TypeController = async (req, res) => {
    try {
        const { title, description, type } = req.body

        if (!title || !description || !type) {
            sendResponse(res, {
                statusCode: 400,
                success: false,
                message: "Title, description, and type are required"
            })
            return
        }

        const decodedUser = req.user as { id?: number }

        if (!decodedUser?.id) {
            sendResponse(res, {
                statusCode: 401,
                success: false,
                message: "Unauthorized request"
            })
            return
        }

        const result = await issuesService.createIssueIntoDB({
            ...req.body,
            reporter_id: decodedUser.id
        })

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Issue created successfully",
            data: result.rows[0],
        })
    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error,
        })
    }
}

export const issuesController = {
    createIssue,
    
}