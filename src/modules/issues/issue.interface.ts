export interface IIssue {
    title: string;
    description: string;
    type: "bug" | "feature_request";
    reporter_id: number;
    status?: "open" | "in_progress" | "resolved";
}

export interface IGetIssuesQuery {
    sort?: 'newest' | 'oldest';
    type?: 'bug' | 'feature_request';
    status?: 'open' | 'in_progress' | 'resolved';
}

export interface IFormattedIssueRow {
    id: number;
    title: string;
    description: string;
    type: string;
    status: string;
    reporter_id: number | null;
    reporter_name: string | null;
    reporter_role: string | null;
    created_at: Date;
    updated_at: Date;
}