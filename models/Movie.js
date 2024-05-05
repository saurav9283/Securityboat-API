import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    duration:{
        type: Number,
        required: true,
    },
    
    genre:{
        type: String,
        required: true,
    },
    language:{
        type: String,
        required: true,
    },
    rating:{
        type: Number,
        required: true,
    },
    
    poster:{
        type: String,
        required: true,
    },
    screen:[{ type: mongoose.Schema.ObjectId, ref: 'Screen' }],
    availableDate: [Date],
    availableTime: [String],
    price: {
        gold:{
            type: Number,
            required: true,
        },
        silver:{
            type: Number,
            required: true,
        },
        platinum:{
            type: Number,
            required: true,
        }
    },

},{timestamps: true});

export default mongoose.model('Movie', movieSchema);
