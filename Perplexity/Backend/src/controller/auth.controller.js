import {
    createUser,
    findUserByEmailOrUsername,
    verifyUser,
    getUserPassword
} from "../repository/user.repository.js";
import { normalizeCredentials, verifyPassword } from "../services/auth.service.js";
import { sendEmail } from "../services/mail.service.js";
import jwt from 'jsonwebtoken';

export async function registerController(req, res, next) {

    const { username, email, password } = req.body;
    let user = null;

    try {
        const { normalizedEmail, passwordHash } = await normalizeCredentials(email, password);
        user = await findUserByEmailOrUsername(normalizedEmail, username);

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = await createUser(username, normalizedEmail, passwordHash);
        res.status(201).json({ message: 'User registered successfully', user });

        const emailVerificationToken = jwt.sign({ userId: user.id, email: user.email, username: user.username, verified: false }, process.env.JWT_SECRET);
        const verificationUrl = `http://localhost:3000/api/auth/verify-user?token=${encodeURIComponent(emailVerificationToken)}`;

        await sendEmail({
            to: normalizedEmail,
            subject: 'Welcome to Perplexity',
            text: `Hi ${user.username},\n\nWelcome to Perplexity! We’re excited to have you on board. Please verify your email by opening this link:\n${verificationUrl}\n\nBest regards,\nTeam Perplexity`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%); padding: 24px; border-radius: 16px; border: 1px solid #e5e7eb; max-width: 560px;">
                    <div style="display: inline-block; padding: 6px 12px; border-radius: 999px; background: #e0f2fe; color: #075985; font-size: 12px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 16px;">Team Perplexity</div>
                    <h2 style="margin: 0 0 12px; color: #111827; font-size: 24px;">Welcome to Perplexity, ${user.username}!</h2>
                    <p style="margin: 0 0 12px;">We’re excited to have you on board. Your account is ready, and one quick step will activate your access.</p>
                    <p style="margin: 0 0 20px;">Click the button below to verify your email address:</p>
                    <div style="margin: 0 0 20px;">
                        <a href="${verificationUrl}" style="display: inline-block; background: #0f172a; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 10px; font-weight: 700;">Verify Email</a>
                    </div>
                    <p style="margin: 0 0 12px; font-size: 14px; color: #6b7280;">If the button does not work, copy and paste this link into your browser:</p>
                    <p style="margin: 0 0 16px; font-size: 14px; word-break: break-all; color: #2563eb;">${verificationUrl}</p>
                    <p style="margin: 0;">Best regards,<br />Team Perplexity</p>
                </div>
            `
        });

    } catch (error) {
        next(error);
    }
}

export async function verifyUserController(req, res, next) {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ message: 'Verification token is required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await findUserByEmailOrUsername(decoded.email, decoded.username);

        if (!user) {
            return res.send(`
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; background: #fff7f7; padding: 24px; border-radius: 12px; border: 1px solid #fee2e2; max-width: 640px; margin: 40px auto;">
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
                        <div style="width:48px; height:48px; border-radius:999px; background:#fecaca; display:flex; align-items:center; justify-content:center;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.001 10h2v5h-2z" fill="#b91c1c"/><path d="M11 16h2v2h-2z" fill="#b91c1c"/></svg>
                        </div>
                        <h2 style="margin:0; color: #b91c1c; font-size:20px;">User Not Found</h2>
                    </div>
                    <p style="margin: 0 0 12px; color:#991b1b;">We couldn’t find an account associated with this verification link. The link may be invalid or expired.</p>
                    <p style="margin:0 0 16px; color:#7f1d1d;">If you just signed up, try registering again or contact support for help.</p>
                    <div style="margin-top:12px;"><a href="http://localhost:5173/login" style="display:inline-block; background:#b91c1c; color:#fff; padding:10px 16px; border-radius:8px; text-decoration:none; font-weight:700;">Create Account</a></div>
                </div>
            `);
        }

        if (user.verified) {
            return res.send(`
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%); padding: 24px; border-radius: 16px; border: 1px solid #e5e7eb; max-width: 560px; margin: 40px auto;">
                    <h2 style="margin: 0 0 12px; color: #16a34a; font-size: 24px;">Already Verified</h2>
                    <p style="margin: 0; color: #065f46;">This account has already been verified — you can safely sign in.</p>
                </div>
            `);
        }

        const verifiedUser = await verifyUser(decoded.userId);
        return res.send(`
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a; background: linear-gradient(180deg,#ffffff 0%, #f8fafc 100%); padding: 28px; border-radius: 14px; border: 1px solid #e6f4ea; max-width: 680px; margin: 40px auto; text-align: center;">
                <div style="display:flex; align-items:center; justify-content:center; gap:14px; margin-bottom:14px;">
                    <div style="width:64px; height:64px; border-radius:999px; background:#bbf7d0; display:flex; align-items:center; justify-content:center;">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17l-5-5" stroke="#064e3b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </div>
                </div>
                <h2 style="margin:0 0 12px; color:#065f46; font-size:22px;">Email Verified</h2>
                <p style="margin:0 0 18px; color:#065f46;">Your email has been successfully verified. You can now sign in and start using Perplexity.</p>
                <a href="http://localhost:5173/login" style="display:inline-block; background:#065f46; color:#fff; padding:12px 20px; border-radius:10px; font-weight:700; text-decoration:none;">Sign In</a>
            </div>
        `);
    } catch (error) {
        next(error);
    }
}

export async function loginController(req, res, next) {
    const { EmailOrUsername, password } = req.body;

    try {
        const { normalizedEmail } = await normalizeCredentials(EmailOrUsername, password);
        const user = await findUserByEmailOrUsername(normalizedEmail, EmailOrUsername);

        if (!user) {
            return res.status(400).json({ message: "Invalid email or username" })
        }

        const passwordData = await getUserPassword(normalizedEmail, EmailOrUsername);

        if (!user.verified) {
            return res.status(403).json({ message: "Please verify your email before logging in" })
        }

        if (!(await verifyPassword(password, passwordData))) {
            return res.status(400).json({ message: "Invalid password" })
        }
        const token = jwt.sign({ userId: user.id, email: user.email, username: user.username }, process.env.JWT_SECRET);
        res.cookie('token', token, { httpOnly: true });
        res.status(200).json({ message: "Login successful", user })

    } catch (err) {
        next(err)
    }
}

export async function getMeController(req, res, next) {
    const user = req.user;

    const responseUser = await findUserByEmailOrUsername(user.email, user.username);

    return res.status(200).json({ user: responseUser });
}