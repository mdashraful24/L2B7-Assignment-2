import { pool } from "../../db";
import { SelfError } from "../../utils/errorResponse";
import type { IGetIssuesQueryStructure, IIssue } from "./issue.interface";

const createIssueIntoDB = async (payload: IIssue) => {

    const { title, description, type, status, reporter_id } = payload

    // All required validation
    if (!title || title.length > 150) {
        throw new SelfError("Title are required and must be at most 150 characters", 400)
    }

    if (!description || description.length < 20) {
        throw new SelfError("Description are required and must be at least 20 characters", 400)
    }

    if (!type) {
        throw new SelfError("Type are required", 400)
    }

    // Create a new issues with details
    const result = await pool.query(`
            INSERT INTO issues (title, description, type, status, reporter_id)
            VALUES ($1, $2, $3, COALESCE($4, 'open'), $5) RETURNING *
        `, [title, description, type, status, reporter_id]
    )

    return result
}

const getAllIssuesFromDB = async (filters: IGetIssuesQueryStructure) => {

    const sort = filters.sort === "oldest" ? "ASC" : "DESC"

    // Get all issues with optional type/status filters with reporter details via subquery
    const result = await pool.query(`
            SELECT id, title, description, type, status, reporter_id,
                (SELECT name FROM users WHERE users.id = issues.reporter_id) AS reporter_name,
                (SELECT role FROM users WHERE users.id = issues.reporter_id) AS reporter_role,
                created_at, updated_at
            FROM issues
            WHERE ($1::text IS NULL OR type = $1)
            AND ($2::text IS NULL OR status = $2)
            ORDER BY id ${sort}
        `, [filters.type || null, filters.status || null]
    )

    return result
}

const getSingleIssueFromDB = async (id: string) => {

    // Get single issues with reporter details via subquery
    const result = await pool.query(`
            SELECT id, title, description, type, status, reporter_id,
                (SELECT name FROM users WHERE users.id = issues.reporter_id) AS reporter_name,
                (SELECT role FROM users WHERE users.id = issues.reporter_id) AS reporter_role,
                created_at, updated_at
            FROM issues
            WHERE id = $1
        `, [id]
    )

    return result
}

const updateIssueFromDB = async (payload: IIssue, id: string) => {

    const { title, description, type, status } = payload

    // All required validation
    if (title !== undefined && title.length > 150) {
        throw new SelfError("Title must be at most 150 characters", 400)
    }

    if (description !== undefined && description.length < 20) {
        throw new SelfError("Description must be at least 20 characters", 400)
    }

    if (type !== undefined && !type) {
        throw new SelfError("Type cannot be empty", 400)
    }

    // Update single issue details
    const result = await pool.query(`
            UPDATE issues SET
                title=COALESCE($1,title),
                description=COALESCE($2,description),
                type=COALESCE($3,type),
                status=COALESCE($4,status)
            WHERE id=$5 RETURNING *
        `, [title, description, type, status, id]
    )

    return result
}

const deleteIssueFromDB = async (id: string) => {

    // Delete single issue
    const result = await pool.query(`
            DELETE FROM issues WHERE id=$1 RETURNING *
        `, [id]
    )

    return result
}

export const issuesService = {
    createIssueIntoDB,
    getAllIssuesFromDB,
    getSingleIssueFromDB,
    updateIssueFromDB,
    deleteIssueFromDB
}