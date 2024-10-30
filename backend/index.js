import express from "express";
import cors from "cors";
import { connectDb } from "./config/db.js";
import { fileURLToPath } from 'url';
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import path from "path";

// app config
const app = express();
const port = 3000;

// middleware
app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'frontend/dist')));



// db connection
connectDb();

// api endpoints
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});

app.use("/api/food", foodRouter);
app.use("/images", express.static(path.join(__dirname, 'uploads')));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get('/', (req, res) => {
  res.send('API Working');
});

app.listen(port, () => {
  console.log(`Food delivery app listening on port ${port}`);
});
