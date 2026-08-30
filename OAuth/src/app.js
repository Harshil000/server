import express from 'express'
import { config } from 'dotenv'
import morgan from 'morgan'
import passport from 'passport'
import { Strategy as GoogleStratergy } from 'passport-google-oauth20'
config()

const app = express()
app.use(morgan('dev'))
app.use(passport.initialize())

passport.use(new GoogleStratergy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, (_, __, profile, done) => {
    return done(null, profile)
}))

app.get('/', (req, res) => {
    res.send("hi");
})

app.get('/auth/google', passport.authenticate('google', { scope: ["profile", "email"] }))

app.get('/auth/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: '/'
    }),
    (req, res) => {
        console.log(req.user)
        res.send('Google authenticated successfully')
    }
)

export default app