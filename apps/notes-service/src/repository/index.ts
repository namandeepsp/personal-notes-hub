import prisma from "../db";
import { CreateNoteDTO, UpdateNoteDTO } from "../types";

export const NotesRepository = {
    create(data: CreateNoteDTO) {
        return prisma.note.create({
            data: {
                userId: data.userId,
                title: data.title,
                content: data.content ?? "",
                tags: data.tags ?? [],
            },
        });
    },

    findAllByUser(userId: string, limit = 20, offset = 0) {
        return prisma.note.findMany({
            where: { userId: userId },
            orderBy: { createdAt: "desc" },
            take: limit,
            skip: offset,
        });
    },

    searchNotes(userId: string, query: string, limit = 20, offset = 0) {
        return prisma.note.findMany({
            where: {
                userId: userId,
                OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { content: { contains: query, mode: "insensitive" } },
                    { tags: { has: query } },
                ],
            },
            orderBy: { updatedAt: "desc" },
            take: limit,
            skip: offset,
        });
    },

    update(noteId: string, data: UpdateNoteDTO) {
        return prisma.note.update({
            where: { id: noteId },
            data,
        });
    },

    delete(noteId: string) {
        return prisma.note.delete({
            where: { id: noteId },
        });
    },
};
