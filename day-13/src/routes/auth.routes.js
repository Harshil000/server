const express = require('express');
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const authRouter = express.Router()

authRouter.post("/register" , async (req , res) => {
    const {name , email , password} = req.body;

    const existingUser = await userModel.findOne({email});

    if(existingUser){
        return res.status(409).json({message : "User already exists"});
    }


    try {
        const user = await userModel.create({name , email , password : crypto.createHash('md5').update(password).digest("hex")});
        const token = jwt.sign({id : user._id , email : email}, process.env.JWT_SECRET)
        res.cookie("jwt_token" , token)
        res.status(201).json({message : "User registered successfully" , token});
    } catch (error) {
        res.status(500).send(error.message);
    }
})

authRouter.post('/protected' , (req , res) => {
    console.log(req.cookies);
    res.status(200).json({message : "This is a protected route"});
})

authRouter.get('/get-user' , async (req , res) => {
    const token = req.cookies.jwt_token;
    if (!token) {
        return res.status(401).json({message : "Unauthorized"});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        res.status(200).json({message : "User found", user});
    } catch (error) {
        res.status(401).json({message : "Invalid token"});
    }
})

authRouter.post('/login' , async (req , res) => {
    const {email , password} = req.body;
    const user = await userModel.findOne({email});
    if (!user) {
        return res.status(404).json({message : "User not found"});
    }

    if (user.password !== crypto.createHash('md5').update(password).digest("hex")) {
        return res.status(401).json({message : "Invalid credentials"});
    }

    const token = jwt.sign({id: user._id, email: email}, process.env.JWT_SECRET);
    res.cookie("jwt_token", token);
    res.status(200).json({
        message: "Login successful",
        user,
        token
    });
})

module.exports = authRouter;