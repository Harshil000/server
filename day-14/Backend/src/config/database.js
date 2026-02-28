require('dotenv').config()
const mongoose = require('mongoose');
const dns = require('dns')
dns.setServers(['8.8.8.8' , '8.8.4.4'])
dns .setDefaultResultOrder('ipv4first');

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to MongoDB")
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB;