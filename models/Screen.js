import mongoose from 'mongoose';

const screenSchema = new mongoose.Schema({
    unavailableDate: [{
        date:{
            type: Date,
            required: true,
        },
        unavailableTime: [String],
    }],
    name:{
        type: String,
        required: true,
    },
    screenNumber:{
        type: Number,
        required: true,
    },
    capacity:{
        gold:{
            type: Number,
            default: 20,
        },
        silver:{
            type: Number,
            default: 20,
        },
        platinum:{
            type: Number,
            default: 20,
        }
    }

},{timestamps: true});

export default mongoose.model('Screen', screenSchema);
