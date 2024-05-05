import Payment from "../models/Payment.js";
import Bookings from "../models/Bookings.js";
import Seat from "../models/Seat.js";
import crypto from "crypto";
import CustomError from "../libs/error.js";

export const paymentVerification = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const bookingId= req.query.bookingId;

    if(!bookingId) throw new CustomError("Invalid Url Booking Id is required", 400)

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_API_SECRET);
    const generated_signature = hmac.update(razorpay_order_id + "|" + razorpay_payment_id,).digest('hex');

    if(!(generated_signature == razorpay_signature)) throw new CustomError("Invalid Signature", 400)

    const razorePay= await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    })

    const updateBooking = await Bookings.findByIdAndUpdate(bookingId, { razorpayId: razorePay._id,status: "BOOKED" }, { new: true });
    Promise.all(
      updateBooking.seats.map(async (seat) => {
        await Seat.findByIdAndUpdate(seat, { status: "BOOKED" });
      })
    );

    res.redirect(`https://payment-gateway-api-iota.vercel.app/paymentsucess?reference=${razorpay_payment_id}`)

  } catch (error) {
    res.status(error.status || 500).send( error.message || "Payment Failed Try Again");
  }
}

export const getPaymentKey = async (req, res) => {
    res.status(200).json({ key: process.env.RAZORPAY_API_KEY });
}
