import express from 'express';
import { addCart, getCart, removeFromCart } from '../controllers/cardController.js'; // Match the file name
import authMiddleware from '../middleware/auth.js';



const cartRouter = express.Router();

cartRouter.post('/add', authMiddleware, addCart);
cartRouter.post('/remove', authMiddleware, removeFromCart);
cartRouter.post('/get', authMiddleware, getCart);

export default cartRouter;