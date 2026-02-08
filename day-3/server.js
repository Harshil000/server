const express = require('express');
const app = express();

app.use(express.json());

const notes = [
    {
        "title" : "Test title 1",
        "description" : "Test description 1"
    },
    {
        "title" : "Test title 2",
        "description" : "Test description 2"
    }
]

app.get('/' , (req , res) => {
    res.send('Hello World');
})

app.get('/about' , (req , res) => {
    res.send('About Page');
})

app.get('/notes' , (req , res) => {
    res.json(notes);
})

app.post('/notes' , (req , res) => {
    console.log(req.body);
    notes.push(req.body);
    res.send('This is a POST request to /notes');
})

app.listen(3000 , () => {
    console.log('server is running on localhost:3000');
})