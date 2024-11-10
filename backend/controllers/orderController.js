import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing user order for frontend
const placeOrder = async (req, res) => {
    const frontend_url = process.env.CLIENT_URL || "http://localhost:5173";
    try {
        const { userId, items, amount, address } = req.body;
        console.log("userId", userId);

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        // Create a new order in the database
        const newOrder = new orderModel({
            userId,
            items,
            amount,
            address
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // Prepare items for Stripe payment
        const lineItems = items.map((item) => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100*80, // Stripe expects the amount in cents
            },
            quantity: item.quantity,
        }));
        lineItems.push({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: 'Delivery Charge',
                },
                unit_amount: 2*100*80, // Assuming delivery charge is $2
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        res.status(200).json({ success: true, sessionId: session.id });
    } catch (err) {
        console.error("Order Creation Error:", err);
        res.status(500).json({ success: false, message: "Failed to create Stripe Checkout session", error: err.message });
    }
};

const verifyOrder = async (req, res) => {
    const {orderId, success  } = req.query;
    console.log("orderId", orderId);
   
    

    try {
        if (success=='true') {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Order placed successfully" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Order failed" });
        }
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: "Failed to verify order" });
    }
};

// Fetch user orders
const userOrders = async (req, res) => {
    try {
        const userId = req.body.userId; // Assuming the user ID is stored in req.user by the auth middleware
        console.log("userId", userId);

        const orders = await orderModel.find({ userId });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ success: false, message: "No orders found for this user" });
        }

        res.status(200).json({ success: true, orders });
    } catch (err) {
        console.error("Error fetching user orders:", err);
        res.status(500).json({ success: false, message: "Failed to fetch user orders", error: err });
    }
};

const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, orders });
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: "Failed to fetch orders" });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Order status updated" });
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: "Failed to update order status" });
    }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateOrderStatus };
