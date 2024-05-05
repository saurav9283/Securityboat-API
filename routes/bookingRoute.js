import express from 'express';
import { verifyToken } from '../middleware/index.js';
import { createBooking, getBookings, getBookingById, updateBooking, deleteBooking } from '../controllers/booking.js';

const router = express.Router();

router.post('/', verifyToken, createBooking).get('/', verifyToken, getBookings);
router.get('/:id', verifyToken, getBookingById).put('/:id', verifyToken, updateBooking).delete('/:id', verifyToken, deleteBooking);

export default router;
