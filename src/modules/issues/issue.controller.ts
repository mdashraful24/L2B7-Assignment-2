import type { TypeController } from "../../types/express.types";
import { USER_ROLE } from "../../types/express.types";
import { errorHandle, SelfError } from "../../utils/errorResponse";
import { sendResponse } from "../../utils/sendResponse";
import type { IFormattedIssueRow } from "./issue.interface";
import { issuesService } from "./issue.service";

const createIssue: TypeController = async (req, res) => {

    try {
        const decodedUser = req.user as { id?: number }

        if (!decodedUser?.id) {
            throw new SelfError("Unauthorized request", 401)
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
        const err = errorHandle(error);

        sendResponse(res, {
            statusCode: err.statusCode || 500,
            success: false,
            message: err.message,
            // error: err,
        });
    }
}

const getAllIssues: TypeController = async (req, res) => {

    try {
        const result = await issuesService.getAllIssuesFromDB(req.query)

        if (result.rows.length === 0) {
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Issue not found",
                data: {}
            })
            return
        }

        // Format each issue with reporter details
        const formattedIssues = result.rows.map((row: IFormattedIssueRow) => ({
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
        }))

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issues retrieved successfully",
            data: formattedIssues
        })
    } catch (error) {
        const err = errorHandle(error);

        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: err.message,
            // error: err,
        });
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
                message: "Issue not found",
                data: {}
            })
            return
        }

        const row = result.rows[0]

        // Format issue with reporter details
        const formateSingleIssue = {
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
            message: "Issue retrieved successfully",
            data: formateSingleIssue
        })
    } catch (error) {
        const err = errorHandle(error);

        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: err.message,
            // error: err,
        });
    }
}

const updateIssue: TypeController = async (req, res) => {

    const { id } = req.params

    try {
        const issueResult = await issuesService.getSingleIssueFromDB(id as string)

        if (issueResult.rows.length === 0) {
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Issue not found",
                data: {}
            })
            return
        }

        const issue = issueResult.rows[0]
        const decodedUser = req.user as { id?: number; role?: string }

        if (!decodedUser?.id || !decodedUser?.role) {
            throw new SelfError("Unauthorized request", 401)
        }

        if (decodedUser.role === USER_ROLE.contributor) {
            if (issue.reporter_id !== decodedUser.id) {
                throw new SelfError("Contributors can only update their own issues", 403)
            }

            if (issue.status !== "open") {
                throw new SelfError("Only open issues can be updated by contributors", 409)
            }
        }

        const result = await issuesService.updateIssueFromDB(req.body, id as string)

        if (result.rows.length === 0) {
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Issue not found",
                data: {}
            })
            return
        }

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue updated successfully",
            data: result.rows[0]
        })
    } catch (error) {
        const err = errorHandle(error);

        sendResponse(res, {
            statusCode: err.statusCode || 500,
            success: false,
            message: err.message,
            // error: err,
        });
    }
}

const deleteIssue: TypeController = async (req, res) => {

    const { id } = req.params

    try {
        const result = await issuesService.deleteIssueFromDB(id as string)

        if (result.rows.length === 0) {
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Issue not found",
                data: {}
            })
            return
        }

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue deleted successfully"
        })
    } catch (error) {
        const err = errorHandle(error);

        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: err.message,
            // error: err,
        });
    }
}

export const issuesController = {
    createIssue,
    getAllIssues,
    getSingleIssue,
    updateIssue,
    deleteIssue
}