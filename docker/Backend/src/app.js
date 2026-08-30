import express from "express"
import morgan from "morgan"
import path from "path"

const app = express()

app.use(express.json())
app.use(morgan("dev"))
app.use(express.static(path.join(process.cwd(), "public")))

app.get('/', (req, res) => {
    res.send("Hello from docker")
})

app.get('/api/user', (req, res) => {
    res.json([
        {
            id: 1,
            name: "Harshil",
            email: "[EMAIL_ADDRESS]"
        },
        {
            id: 2,
            name: "John",
            email: "[EMAIL_ADDRESS]"
        }
    ])
})

app.get('*name' , (req , res) => {
    res.sendFile(path.join(process.cwd() , 'public' , 'index.html'))
})

export default app