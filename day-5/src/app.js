const express = require('express');
const app = express();

app.use(express.json())

let notes = []

app.get('/' , (req , res) => {
    res.send('Hello world')
})

app.get('/notes' , (req , res) => {
    res.status(200).json(notes)
})

app.post('/notes' , (req , res) => {
    notes.push(req.body);
    res.status(201).json({
        "message" : "Note added successfully"
    })
})

app.delete('/notes/:index' , (req , res) => {
    let {index} = req.params;
    index = parseInt(index)
    delete notes[index];
    res.status(204)
})

app.patch('/notes/:index' , (req , res) => {
    let {index} = req.params;
    index = parseInt(index)
    notes[index].description = req.body.description;
    res.status(200).json({
        "message" : "Note updated successfully"
    })
})

module.exports = app;