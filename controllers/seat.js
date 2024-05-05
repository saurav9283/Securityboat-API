import CustomError from '../libs/error.js';
import Seat from '../models/Seat.js';

export const createSeat = async (req, res) => {
    try {
        const { movie, screen, type, seatNo } = req.body;
        console.log(req.body);
        if (!movie) throw new CustomError('Movie id is required', 400);
        if (!screen) throw new CustomError('Screen id is required', 400);
        if (!type) throw new CustomError('Type is required', 400);
        if (!seatNo) throw new CustomError('Seat number is required', 400);

        let seat = await Seat.findOne({ movie, screen, type, seatNo });
        if (seat) {
            if (seat.status === 'BOOKED') throw new CustomError('Seat is already booked', 409);
            const date = new Date();
            let seatUpdationDate = new Date(seat.updatedAt);
            seatUpdationDate.setMinutes(seatUpdationDate.getMinutes() + 10);

            if (seat.status === 'PENDING' && date <= seatUpdationDate)
                throw new CustomError('Seat is already booked by someone else. Please try again after 10 minutes', 409);
        }

        if (seat) seat.updatedAt = new Date();
        else seat = new Seat(req.body);

        await seat.save();
        res.status(201).send(seat);
    } catch (error) {
        console.log(error.message);
        res.status(error?.status || 500).send(error.message);
    }
};

export const getSeats = async (req, res) => {
    try {
        const { movie, screen, type } = req.query || {};
        if (!movie) throw new CustomError('Movie id is required', 400);
        if (!screen) throw new CustomError('Screen id is required', 400);
        let filter = { movie, screen };
        if (type) filter.type = type;

        const seats = await Seat.find(filter);
        res.status(200).send({
            total: seats.length,
            data: seats
        });
    } catch (error) {
        console.log(error);
        res.status(error?.status || 500).send(error.message);
    }
};

export const getSeatById = async (req, res) => {
    try {
        const seat = await Seat.findById(req.params.id);
        res.status(200).send(seat);
    } catch (error) {
        res.status(error?.status || 500).send(error.message);
    }
};

export const updateSeat = async (req, res) => {
    try {
        const updatedSeat = await Seat.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).send(updatedSeat);
    } catch (error) {
        res.status(error?.status || 500).send(error.message);
    }
};

export const deleteSeat = async (req, res) => {
    try {
        await Seat.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: 'Seat deleted successfully' });
    } catch (error) {
        res.status(error?.status || 500).send(error.message);
    }
};
