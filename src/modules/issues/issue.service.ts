import { pool } from "../../db";
import type { IGetIssuesQuery, IIssue } from "./issue.interface";

const createIssueIntoDB = async (payload: IIssue) => {
    const { title, description, type, status, reporter_id } = payload

    const result = await pool.query(`
            INSERT INTO issues (title, description, type, status, reporter_id)
            VALUES ($1, $2, $3, COALESCE($4, 'open'), $5) RETURNING *
        `, [title, description, type, status, reporter_id]
    )

    return result
}

const getAllIssuesFromDB = async (filters: any) => {
    const sort = filters.sort === "oldest" ? "ASC" : "DESC"

    // Check Both type and status
    if (filters.type && filters.status) {
        return await pool.query(`
            SELECT * FROM issues 
            WHERE type = $1 AND status = $2 
            ORDER BY id ${sort}
        `, [filters.type, filters.status])
    }

    // Check Only type
    if (filters.type) {
        return await pool.query(`
            SELECT * FROM issues 
            WHERE type = $1 
            ORDER BY id ${sort}
        `, [filters.type])
    }

    // Check Only status
    if (filters.status) {
        return await pool.query(`
            SELECT * FROM issues 
            WHERE status = $1 
            ORDER BY id ${sort}
        `, [filters.status])
    }

    // No filters
    return await pool.query(`
        SELECT * FROM issues 
        ORDER BY id ${sort}
    `)
}

const getSingleIssueFromDB = async (id: string) => {
    const result = await pool.query(`
            SELECT
                issues.id,
                issues.title,
                issues.description,
                issues.type,
                issues.status,
                issues.created_at,
                issues.updated_at,
                
                users.id AS reporter_id,
                users.name AS reporter_name,
                users.role AS reporter_role
            FROM issues
            LEFT JOIN users ON issues.reporter_id = users.id
            WHERE issues.id = $1
        `, [id]
    )

    return result
}

const updateIssueFromDB = async (payload: IIssue, id: string) => {

    const { title, description, type, status } = payload

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