const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
    follower : {ref : "users" , type : String , required : [true , "follower id is required"]},
    following : {ref : "users" , type : String , required : [true , "following id is required"]},
    status : {type: String , default : "pending" , enum : {values : ["pending" , "accepted" , "rejected"] , message : "VALUE is not supported"}},
},{timestamps : true})

followSchema.index({follower : 1 , following : 1} , {unique : true})

const followModel = mongoose.model('follows' , followSchema)

module.exports = followModel;