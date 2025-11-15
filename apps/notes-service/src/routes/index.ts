import { Router } from '@naman_deep_singh/server-utils';
import { NotesController } from '../controllers';

const router = Router();

// Create a note
router.post('/', NotesController.create);

// Get all notes
router.get('/', NotesController.getAll);

// Search notes
router.get('/search', NotesController.search);

// Update a note
router.put('/:id', NotesController.update);

// Delete a note
router.delete('/:id', NotesController.delete);

export default router;
