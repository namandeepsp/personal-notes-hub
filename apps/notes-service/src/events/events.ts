export const Events = {
    NOTE_CREATED: "note.created",
    NOTE_UPDATED: "note.updated",
    NOTE_DELETED: "note.deleted",
} as const;

export type EventName = (typeof Events)[keyof typeof Events];
