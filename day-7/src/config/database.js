require('dotenv').config()
const dns = require("dns")
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

const mongoose = require('mongoose')

function connectDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Database connected successfully")
    })
    .catch((err) => {
        console.log(err)
    })
}

module.exports = connectDB