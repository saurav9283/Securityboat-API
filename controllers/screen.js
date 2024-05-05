import CustomError from '../libs/error.js';
import Screen from '../models/Screen.js';

export const createScreen = async (req, res) => {
    try {
        const user = req.user;
        if(!user.isAdmin) throw new CustomError('You are not authorized', 403);
        let {name,capacity:{gold,silver,platinum},screenNumber}= req.body;
        if(!gold && !silver && !platinum){
            throw new CustomError('Please provide capacity for each type of seat', 400);   
        }

        if(!screenNumber) throw new CustomError('Please provide screen number', 400);

        const isScreenAlreadyExist = await Screen.findOne({screenNumber});
        if(isScreenAlreadyExist) throw new CustomError('Screen already exists', 409);

        gold = parseInt(gold);
        silver = parseInt(silver);
        platinum = parseInt(platinum);
        screenNumber = parseInt(screenNumber);

        const totalCapacity = gold + silver + platinum;
        if(totalCapacity >60) throw new CustomError('Total capacity should not exceed 60', 400);

        const screen = new Screen({name,screenNumber ,capacity: { gold, silver, platinum }});
        await screen.save();
        res.status(201).json(screen);
    } catch (error) {
        console.log(error.message)
        res.status(error?.status || 500).send(error.message);
    }
};


export const getScreen = async (req, res) => {
    try {
        const screen = await Screen.find();
        res.status(200).json(screen);
    } catch (error) {
        res.status(error?.status || 500).send(error.message);
    }
};

export const getScreenById = async (req, res) => {
    try {
        const screen = await Screen.findById(req.params.id);
        res.status(200).json(screen);
    } catch (error) {
        res.status(error?.status || 500).send(error.message);
    }
};

export const updateScreen = async (req, res) => {
    try {
        const user = req.user;
        if(!user.isAdmin) throw new CustomError('You are not authorized', 403);
        const updatedScreen = await Screen.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json(updatedScreen);
    }
    catch (error) {
        res.status(error?.status || 500).send(error.message);
    }
}

export const deleteScreen = async (req, res) => {
    try {
        const user = req.user;
        if(!user.isAdmin) throw new CustomError('You are not authorized', 403);
        await Screen.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Screen deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
