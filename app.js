import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRouter.js";
import screenRoute from "./routes/screenRoute.js";
import movieRoute from "./routes/movieRoute.js";
import bookingRoute from "./routes/bookingRoute.js";
import seatRoute from "./routes/seatRoute.js";
import paymentRouter from "./routes/paymentRoute.js";
import cookiesparser from 'cookie-parser';
import bodyParser from 'body-parser';


const app = express();
app.use(cookiesparser());
app.use(cors());

connectDB();

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/" , (req, res) =>{
  res.send("API is running !");
})

app.use("/payment", paymentRouter);
app.use("/auth", authRoute);
app.use("/screen", screenRoute);
app.use("/movie", movieRoute);
app.use("/booking", bookingRoute);
app.use("/seat", seatRoute);


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
