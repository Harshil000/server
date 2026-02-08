const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4'])
dns.setDefaultResultOrder('ipv4first');

function connectDB() {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => { console.log("connected to DB") })
        .catch((err) => { console.log(err) });
}

module.exports = connectDB;