import mongoose from 'mongoose';

const { Schema } = mongoose;

const bookingSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    movie: {
        type: Schema.Types.ObjectId,
        ref: 'Movie',
        required: true,
    },
    screen: {
        type: Schema.Types.ObjectId,
        ref: 'Screen',
        required: true,
    },
    status: {
        type: String,
        enum: ['PENDING', 'BOOKED', 'CANCELLED'],
        default: 'PENDING',
    },
    amount: {
        type: Number,
        required: true,
    },
    razorpayId: {
        type: Schema.Types.ObjectId, ref: 'Payment' 
    },
    seats: [{ type: Schema.Types.ObjectId, ref: 'Seat' }],
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
