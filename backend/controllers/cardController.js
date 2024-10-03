import userModel from '../models/userModel.js';

//add items to user cart

const addCart = async (req, res) => {
    try {
        // Find the user by ID
        let userData = await userModel.findById(req.body.userId);
        let cartData = userData.cartData;
        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get the cart data
        
        // Update the cart data
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });

        res.status(200).json({ message: 'Item added to cart' });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//remove items from user cart
const removeFromCart=async(req,res)=>{
    try {
        let userData=await userModel.findById(req.body.userId);
        let cartData=await userData.cartData;
        if(cartData[req.body.itemId]>0){
            cartData[req.body.itemId]-=1;
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData});
        res.status(200).json({message:'Item removed from cart'});


}
catch (error) {
    res.status(500).json({message:'Internal server error'});
}
}


//fetch user cart
const getCart=async(req,res)=>{
    try {
        let userData=await userModel.findById(req.body.userId);
        console.log(req.body.userId);
        
        let cartData=await userData.cartData;
        res.status(200).json({success:true,cartData});
    } catch (error) {
        res.status(500).json({message:'Internal server error'});
    }
}


export {addCart,removeFromCart,getCart}