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
    } catch (error) {
        let message = "Something went wrong"

        if (error instanceof Error) {
            message = error.message
        }

        sendResponse(res, {
            statusCode: 500,
            success: false,
            message,
            error,
        })
    }
}

const getAllIssues: TypeController = async (req, res) => {
    try {
        const result = await issuesService.getAllIssuesFromDB(req.query)

        sendResponse(res, {
            statusCode: 200,
            success: true,
            // message: "Issues retrieved successfully!",
            data: result.rows
        })
    } catch (error) {
        let message = "Something went wrong"

        if (error instanceof Error) {
            message = error.message
        }

        sendResponse(res, {
            statusCode: 500,
            success: false,
            message,
            error,
        })
    }
}

const getSingleIssue: TypeController = async (req, res) => {
    const { id } = req.params

    try {
        const result = await issuesService.getSingleIssueFromDB(id as string)

        if (result.rows.length === 0) {
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Issue not found!",
                data: {}
            })
            return
        }

        const row = result.rows[0]
        const issue = {
            id: row.id,
            title: row.title,
            description: row.description,
            type: row.type,
            status: row.status,
            reporter: row.reporter_id ? {
                id: row.reporter_id,
                name: row.reporter_name,
                role: row.reporter_role,
            } : null,
            created_at: row.created_at,
            updated_at: row.updated_at,
        }

        sendResponse(res, {
            statusCode: 200,
            success: true,
            data: issue
        })
    } catch (error) {
        let message = "Something went wrong"

        if (error instanceof Error) {
            message = error.message
        }

        sendResponse(res, {
            statusCode: 500,
            success: false,
            message,
            error,
        })
    }
}


export const issuesController = {
    createIssue,
    getAllIssues,
    getSingleIssue,

}