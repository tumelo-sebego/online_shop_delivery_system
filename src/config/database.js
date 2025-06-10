const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Test the connection
        const dbState = mongoose.connection.readyState;
        switch (dbState) {
            case 0:
                console.log('MongoDB: Disconnected');
                break;
            case 1:
                console.log('MongoDB: Connected');
                break;
            case 2:
                console.log('MongoDB: Connecting');
                break;
            case 3:
                console.log('MongoDB: Disconnecting');
                break;
            default:
                console.log('MongoDB: Unknown state');
        }
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
