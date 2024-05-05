require("dotenv").config();
const connectDB = require("../config/db");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
connectDB();

const createAdmin = async () => {
    try {
        const admin = await User.findOne({ email: "admin@gmail.com" });
        if (admin) {
            console.log("Admin already exists");
            return;
        }
        const hashPassword = await bcrypt.hash("admin123", 10);
        await User.create(
            {
                name: "Admin",
                email: "admin@gamil.com",
                password: hashPassword,
                isAdmin: true,
            }
        );

        console.log("Admin created successfully");
    }
    catch (error) {
        console.log(error.message);
    }
};

createAdmin();