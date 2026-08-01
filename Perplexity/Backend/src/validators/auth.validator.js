import {body , validationResult} from "express-validator";

const validate = (req , res , next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

export const registerValidator = [
    body("username")
        .isLength({ min: 3, max: 20 })
        .withMessage("Username must be between 3 and 20 characters"),
    body("email")
        .isEmail()
        .withMessage("Please provide a valid email"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    validate
];

export const loginValidator = [
    body("EmailOrUsername")
        .notEmpty()
        .withMessage("Please provide a valid email or username"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    validate
];