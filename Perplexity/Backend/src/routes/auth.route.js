import { Router } from "express";
import { registerValidator , loginValidator } from "../validators/auth.validator.js";
import { registerController , verifyUserController , loginController , getMeController } from "../controller/auth.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post('/register', registerValidator, registerController)
authRouter.post('/login' , loginValidator , loginController)
authRouter.get('/verify-user', verifyUserController)
authRouter.get('/getMe' , authenticateToken ,getMeController)

export default authRouter;