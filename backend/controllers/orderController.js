import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import paypal from "paypal-rest-sdk";
import dotenv from "dotenv";
dotenv.config();

// Configure PayPal with the credentials you got when you created your PayPal app
paypal.configure({
    mode: "sandbox", // or "live"
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.SECRET_ID
});

// Placing user order for frontend
const placeOrder = async (req, res) => {
    try {
        const { userId } = req.body;
        console.log(userId);
        

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        // Create a new order in the database
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Prepare items for PayPal payment
        const items = req.body.items.map(item => ({
            name: item.name,
            sku: item._id,
            price: (item.price / 80).toFixed(2), // Assuming price is in INR and converting to USD
            currency: "USD",
            quantity: item.quantity
        }));

        const deliveryCharge = {
            name: "Delivery Charge",
            sku: "delivery",
            price: (2 / 80).toFixed(2), // Assuming delivery charge is in INR and converting to USD
            currency: "USD",
            quantity: 1
        };

        const itemTotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const deliveryAmount = parseFloat(deliveryCharge.price);
        const totalAmount = (itemTotal + deliveryAmount).toFixed(2);

        // Create PayPal payment JSON
        const create_payment_json = {
            intent: "sale",
            payer: {
                payment_method: "paypal"
            },
            redirect_urls: {
                return_url: `http://localhost:5174/verify?success=true&orderId=${newOrder._id}`,
                cancel_url: `http://localhost:5174/verify?success=false&orderId=${newOrder._id}`
            },
            transactions: [{
                item_list: {
                    items: items.concat(deliveryCharge)
                },
                amount: {
                    currency: "USD",
                    total: totalAmount,
                    details: {
                        subtotal: totalAmount
                    }
                },
                description: "This is the payment description."
            }]
        };

        // Create PayPal payment
        paypal.payment.create(create_payment_json, (error, payment) => {
            if (error) {
                console.error("PayPal Error:", error.response);
                res.status(500).json({ success: false, message: "Failed to create PayPal payment", error: error.response });
            } else {
                const approvalUrl = payment.links.find(link => link.rel === "approval_url").href;
                res.status(200).json({ success: true, approval_url: approvalUrl });
            }
        });
    } catch (err) {
        console.error("Order Creation Error:", err);
        res.status(500).json({ success: false, message: "Failed to place order", error: err });
    }
};
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.query; 
    console.log(orderId);
    // Use req.query to get orderId and success from URL
    try {
        if (success === 'true') {
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
        const orders = await orderModel.find({});
        res.json({ success: true,orders });
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