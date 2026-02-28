const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    caption : {type : String , default : ""},
    imgUrl : {type : String , required : [true , "image url is required"]},  
    user : {ref : "users" , type : mongoose.Schema.Types.ObjectId , required : [true , "user id is required"]},
    timeStamp : {type : Date , default : Date.now}
})

const postModel = mongoose.model('post' , postSchema)

module.exports = postModel