const express = require('express')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/auth.routes')
const postRouter = require('./routes/post.routes')
const userRouter = require('./routes/user.routes')
const cors = require('cors')


const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use('/api/auth' , authRouter)
app.use('/api/posts' , postRouter)
app.use('/api/users' , userRouter)

app.get('/' , (req , res) => {
    res.send('Hello World!')
})

module.exports = app