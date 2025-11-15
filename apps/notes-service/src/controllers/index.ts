import { Request, Response } from "express";
import { NotesService } from "../services";

export const NotesController = {
    async create(req: Request, res: Response) {
        const userId = req.user.id;
        const data = req.body;

        const note = await NotesService.create(userId, data);
        res.status(201).json(note);
    },

    async getAll(req: Request, res: Response) {
        const userId = req.user.id;
        const limit = Number(req.query.limit) || 20;
        const offset = Number(req.query.offset) || 0;

        const notes = await NotesService.getAll(userId, { limit, offset });
        res.json(notes);
    },

    async search(req: Request, res: Response) {
        const userId = req.user.id;
        const query = String(req.query.q || "");
        const limit = Number(req.query.limit) || 20;
        const offset = Number(req.query.offset) || 0;

        const notes = await NotesService.search(userId, query, { limit, offset });
        res.json(notes);
    },

    async update(req: Request, res: Response) {
        const noteId = req.params.id;
        const data = req.body;

        const note = await NotesService.update(noteId, data);
        res.json(note);
    },

    async delete(req: Request, res: Response) {
        const noteId = req.params.id;

        const deleted = await NotesService.delete(noteId);
        res.json(deleted);
    },
};
