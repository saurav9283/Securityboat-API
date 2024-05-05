import instance from '../config/razorePay.js';
import Booking from '../models/Bookings.js';

export const createBooking = async (req, res) => {
    try {
        const { user, movie, screen, seats, amount } = req.body;
        const booking = new Booking({ user, movie, screen, seats, amount });
        await booking.save();
        const options = {
            amount: Number(req.body.amount * 100), // convert in paise
            currency: "INR",
        };
        const order = await instance.orders.create(options);
        console.log({ booking, order });
        res.status(201).send({ booking, order });

    } catch (error) {
        res.status(error?.status || 500).send(error.message);
    }
};

export const getBookings = async (req, res) => {
    try {
        const { userId, status } = req.query;

        let filter = {};
        if (userId) filter.user = userId;
        if (status) filter.status = status;

        const bookings = await Booking.find(filter).populate("razorpayId");
        res.status(200).send(bookings);
    } catch (error) {
        res.status(error?.status || 500).send(error.message);
    }
};

export const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate("razorpayId");
        res.status(200).send(booking);
    } catch (error) {
        res.status(error?.status || 500).send(error.message);
    }
};

export const updateBooking = async (req, res) => {
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).send(updatedBooking);
    }
    catch (error) {
        res.status(error?.status || 500).send(error.message);
    }
}

export const deleteBooking = async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(error?.status || 500).send(error.message);
    }
}
