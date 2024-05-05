import { createScreen, getScreen, getScreenById, updateScreen, deleteScreen } from '../controllers/screen.js';
import { verifyToken } from '../middleware/index.js';
import express from 'express';

const router = express.Router();

router.post('/', verifyToken, createScreen).get('/', verifyToken, getScreen);
router.get('/:id', verifyToken, getScreenById).put('/:id', verifyToken, updateScreen).delete('/:id', verifyToken, deleteScreen);

export default router;
