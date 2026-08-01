require('dotenv').config()
const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const ImageKit = require('@imagekit/nodejs')
const { toFile } = require('@imagekit/nodejs')

const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
})

async function registerController(req, res) {
    const { name, userName, email, password, bio } = req.body

    const userExists = await userModel.findOne({ $or: [{ email }, { userName }] })

    if (userExists) {
        return res.status(409).json({ msg: `user with same ${userExists.email === email ? "email" : "username"} already exists` })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    let profile_image = null
    
    if (req.file) {
        const files = await client.files.upload({
            file: await toFile(Buffer.from(req.file.buffer), 'file'),
            fileName: req.file.originalname,
            folder: '/usersProfilePic'
        })
        profile_image = files.url
    }

    const createdUser = await userModel.create({
        name,
        userName,
        email,
        password: hashedPassword,
        bio,
        profile_image
    })

    const token = jwt.sign({ id: createdUser._id, email: createdUser.email, userName: createdUser.userName }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
    res.cookie('jwt_token', token , {httpOnly: true})
    res.status(201).json({ msg: "user registered successfully", user: { name, userName, email, bio, profile_image: createdUser.profile_image }, token })
}

async function loginController(req, res) {
    const { email, password, userName } = req.body
    
    const user = await userModel.findOne({ $or: [{ email }, { userName }] })

    if (!user) {
        return res.status(404).json({ msg: "user not found" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(401).json({ msg: "invalid credentials" })
    }

    const token = jwt.sign({ id: user._id, email: user.email, userName: user.userName }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
    res.cookie('jwt_token', token)
    res.status(200).json({ msg: "login successful", user: { name: user.name, userName: user.userName, email: user.email, bio: user.bio, profile_image: user.profile_image }, token })
}



module.exports = { registerController, loginController }