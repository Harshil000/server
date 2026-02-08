const express = require('express')

const app = express(); //server created

app.get('/home' , (req , res) => {
    res.send('Hello World');
})
    
app.listen(3000); //server started