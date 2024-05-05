import CustomError from '../libs/error.js';
import Movie from '../models/Movie.js';
import Screen from '../models/Screen.js';

export const createMovie = async (req, res) => {
    try {
        const user = req.user;
        if(!user.isAdmin) throw new CustomError('You are not authorized', 403);
        const { screen, availableTime, availableDate } = req.body;
        if (!screen) throw new CustomError('Screen is required', 400);
        if (!availableTime && availableTime?.length) throw new CustomError('Available Time is required', 400);
        if (!availableDate && availableDate?.length) throw new CustomError('Available Date is required', 400);
    
        await Promise.all(screen.map(async (screenId) => {
            const screenDetails = await Screen.findById(screenId);
            if (!screenDetails) throw new CustomError('Screen not found', 404);

            const unavailableDate = screenDetails.unavailableDate.map(date => date?.date?.toISOString());
            const isScreenAvailable = availableDate.some(date => unavailableDate.includes(date));
            if (isScreenAvailable) {
                throw new CustomError(`Screen is ${screenDetails.screenNumber} not available`, 400);
            }
        }));
    
        const movie = new Movie(req.body);
        await movie.save();
        const unavailableDatesWithTime = availableDate.map(date => ({ date, unavailableTime: availableTime }));
        let screenDetails = [];
        await Promise.all(screen.map(async (screenId) => {
            const screen = await Screen.findByIdAndUpdate(screenId, { $push: { unavailableDate: unavailableDatesWithTime } }, { new: true });
            screenDetails.push(screen);
        }));
        // console.log({ ...movie._doc, screen: screenDetails })
        

        const movieDetailsWithScreen = await Movie.findById(movie._id).populate('screen');
        console.log(movieDetailsWithScreen);
        res.status(201).send(movieDetailsWithScreen);

    
    } catch (error) {
        console.log(error.message)
        res.status(error?.status || 500).send(error.message);
    }
};

export const getMovies = async (req, res) => {
    try {
        const { language, genre, rating, query } = req.query || {};
        let filter = {};
        if (language) filter.language = language;
        if (genre) filter.genre = genre;
        if (rating) filter.rating = { $gte: rating };

        if (query) filter.name = new RegExp(query, 'i');
        
        const movies = await Movie.find(filter).populate('screen');

        res.status(200).send({
            total: movies.length,
            data: movies
        });
    } catch (error) {
        console.log(error)
        res.status(error?.status || 500).send(error.message);
    }
};

export const getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        res.status(200).send(movie);
    } catch (error) {
        console.log(error)
        res.status(error?.status || 500).send(error.message);
    }
};


export const updateMovie = async (req, res) => {
    try {
        const user = req.user;
        if(!user.isAdmin) throw new CustomError('You are not authorized', 403);
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).send(updatedMovie);
    }
    catch (error) {
        console.log(error)
        res.status(error?.status || 500).send(error.message);
    }
};

export const deleteMovie = async (req, res) => {
    try {
        const user = req.user;
        if(!user.isAdmin) throw new CustomError('You are not authorized', 403);
        await Movie.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: 'Movie deleted successfully' });
    } catch (error) {
        console.log(error)
        res.status(error?.status || 500).send(error.message);
    }
};
