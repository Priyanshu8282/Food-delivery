import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        const uri = 'mongodb+srv://priyanshus8282:priyanshu123@cluster0.zwfvr.mongodb.net/';
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}