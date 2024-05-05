import express from 'express';
import { createSeat, getSeats, getSeatById, updateSeat, deleteSeat } from '../controllers/seat.js';
import { verifyToken } from '../middleware/index.js';

const router = express.Router();

router.post('/', verifyToken, createSeat).get('/', getSeats);
router.get('/:id', verifyToken, getSeatById).put('/:id', verifyToken, updateSeat).delete('/:id', verifyToken, deleteSeat);

export default router;
