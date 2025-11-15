import { NotesRepository } from "../repository";
import { CreateNoteDTO, UpdateNoteDTO, PaginationParams } from "../types";
import { eventBus } from "../events/eventBus";
import { Events } from "../events/events";

export const NotesService = {
    async create(userId: string, data: CreateNoteDTO) {
        const note = await NotesRepository.create({ ...data, userId });

        eventBus.emitEvent(Events.NOTE_CREATED, note);

        return note;
    },

    async getAll(userId: string, { limit = 20, offset = 0 }: PaginationParams) {
        return NotesRepository.findAllByUser(userId, limit, offset);
    },

    async search(userId: string, query: string, params: PaginationParams) {
        return NotesRepository.searchNotes(userId, query, params.limit, params.offset);
    },

    async update(noteId: string, data: UpdateNoteDTO) {
        const updated = await NotesRepository.update(noteId, data);

        eventBus.emitEvent(Events.NOTE_UPDATED, updated);

        return updated;
    },

    async delete(noteId: string) {
        const deleted = await NotesRepository.delete(noteId);

        eventBus.emitEvent(Events.NOTE_DELETED, deleted);

        return deleted;
    },
};
