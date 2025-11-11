import mongoose from 'mongoose';
import process from 'process';
import { env } from './environment';

const connectDB = async () => {
    try {
        await mongoose.connect(env.MONGODB_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};

export default connectDB;
