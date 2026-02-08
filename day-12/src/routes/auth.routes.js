const express = require('express');
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const authRouter = express.Router()

authRouter.post("/register" , async (req , res) => {
    const {name , email , password} = req.body;

    const existingUser = await userModel.findOne({email});

    if(existingUser){
        return res.status(400).json({message : "User already exists"});
    }


    try {
        const user = await userModel.create({name , email , password});
        const token = jwt.sign({id : user._id , email : email}, process.env.JWT_SECRET)
        res.cookie("jwt_token" , token)
        res.status(201).json({message : "User registered successfully" , token : token});
    } catch (error) {
        res.status(500).send(error.message);
    }
})

module.exports = authRouter;