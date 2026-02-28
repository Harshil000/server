const mongoose = require('mongoose')

let likeSchema = new mongoose.Schema({
    postId : {ref : "posts" , type : mongoose.Schema.Types.ObjectId , required : [true , "post id is required"]},
    userName : {ref : "users" , type : String , required : [true , "username is required"]},
}, {timestamps : true})

likeSchema.index({postId : 1 , userName : 1} , {unique : true})

const likeModel = mongoose.model('likes' , likeSchema)
module.exports = likeModel;