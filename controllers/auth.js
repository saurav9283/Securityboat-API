import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import CustomError from "../libs/error.js";

export const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      throw new CustomError("Please fill all the fields", 400);
    }
    const emailExist = await User.findOne({ email });
    if (emailExist) throw new CustomError("email already exist", 409);

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashPassword, name });
    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    console.error("Error creating the user", error);
    res.status(error?.status || 500).send(error.message);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      throw new CustomError("Please fill all the fields", 400);

    const user = await User.findOne({ email });
    if (!user) throw new CustomError("User not found", 404);

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) throw new CustomError("Invalid Password", 400);

    const userObj = user.toJSON();
    delete userObj.password;

    const token = jwt.sign({ id: userObj._id, isAdmin: userObj.isAdmin,email:userObj.email }, process.env.JWT_SECRET);
    res.cookie("access_token", token, { httpOnly: true }).status(200).send({ data: userObj, token });

  } catch (err) {
    console.error("Error logging in", err);
    res.status(err?.status || 500).send(err.message);
  }
};
