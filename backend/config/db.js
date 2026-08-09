import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const connString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/signalsense_ai';

  try {
    const conn = await mongoose.connect(connString, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`[Database] MongoDB Connection Warning: ${error.message}`);
    console.warn(`[Database] Operating with fallback dataset mode.`);
    return false;
  }
};

export const getDBStatus = () => isConnected;
