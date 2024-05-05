import express from 'express';
import { verifyToken } from '../middleware/index.js';
import { createMovie, getMovies, getMovieById, updateMovie, deleteMovie } from '../controllers/movie.js';

const router = express.Router();

router.post('/', verifyToken, createMovie);
router.get('/', getMovies);
router.get('/:id', getMovieById);
router.put('/:id', verifyToken, updateMovie);
router.delete('/:id', verifyToken, deleteMovie);

export default router;