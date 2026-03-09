const express = require('express')
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() })
const authController = require('../controllers/auth.controller')
const identifyUser = require('../middlewares/auth.middleware')

const authRoute = express.Router()

authRoute.post('/register', upload.single('profilePic'), authController.registerController)
authRoute.post('/login', authController.loginController)
authRoute.get('/getMe', identifyUser, authController.getMeController)

module.exports = authRoute;