const express = require('express')

const app = express(); //server created
app.use(express.static('../public')) 

app.get('/' , (req , res) => {
    res.sendFile('index.html', { root: './public' });
})
app.get('/home' , (req , res) => {
    res.send('<h2>Welcome to Home Page!</h2>');
})
app.get('/about' , (req , res) => {
    res.send('<h2>About Us: This is a demo SPA using Express and HTML.</h2>');
})
app.get('/contact' , (req , res) => {
    res.send('<h2>Contact Us: demo@example.com</h2>');
})
    
module.exports = app;