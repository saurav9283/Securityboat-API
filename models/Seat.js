import mongoose from 'mongoose';

const { Schema } = mongoose;

const seatSchema = new Schema({
    movie:{
        type: Schema.Types.ObjectId,
        ref: 'Movie',
        required: true,
    },
    screen:{
        type: Schema.Types.ObjectId,
        ref: 'Screen',
        required: true,
    },
    seatNo: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['BOOKED', 'PENDING'],
        default: 'PENDING',
    },
    
    type:{
        type: String,
        enum: ['GOLD', 'SILVER', 'PLATINUM'],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

export default mongoose.model('Seat', seatSchema);