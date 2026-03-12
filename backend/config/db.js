const mongoose = require('mongoose');
let isDBConnected = false;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        isDBConnected = true;
    } catch (error) {
        console.error(`\x1b[31m[ERROR] MongoDB Connection Failed!\x1b[0m`);
        console.error(`Error details: ${error.message}`);
        
        if (error.message.includes('querySrv ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
            console.error(`\x1b[33m[TIP] Connection issue detected (DNS or Network). Your network might be blocking MongoDB Atlas.\x1b[0m`);
            console.error(`\x1b[33m[OFFLINE MODE] Falling back to Mock Database for testing...\x1b[0m`);
        } else {
            console.error(`\x1b[33m[OFFLINE MODE] Starting with Mock Database due to connection error.\x1b[0m`);
        }
    }
};

module.exports = { connectDB, getIsDBConnected: () => isDBConnected };
