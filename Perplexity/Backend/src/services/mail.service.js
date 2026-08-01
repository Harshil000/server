import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GOOGLE_USER,
        pass: process.env.GOOGLE_APP_PASSWORD,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

export const sendEmail = async ({to, subject, text, html}) => {
    try {

        const mailOptions = {
            from: process.env.GOOGLE_USER, // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html, // html body
        }

        const info = await transporter.sendMail(mailOptions);

        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};