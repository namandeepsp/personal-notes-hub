export interface CreateNoteDTO {
    userId: string;
    title: string;
    content?: string;
    tags?: string[];
}

export interface UpdateNoteDTO {
    title?: string;
    content?: string;
    tags?: string[];
}

export interface PaginationParams {
    limit?: number;
    offset?: number;
}
