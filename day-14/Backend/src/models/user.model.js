const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {type : String , required : [true , "name is required"]},
    userName : {type : String , unique : [true , "username already exists"] , required : [true , "username is required"]},
    email : {type : String , unique : [true , "email already exists"] , required : [true , "email is required"]},
    password : {type : String , required : [true , "password is required"]},
    bio : String,
    profile_image : {
        type : String,
        default : "https://ik.imagekit.io/HDU/image.png"
    }
})

const userModel = mongoose.model('users' , userSchema)

module.exports = userModel;