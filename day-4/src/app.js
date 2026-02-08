const express = require('express');
const app = express();

app.use(express.json());

const notes = [
    { "title": "test title 1", "description": "test description 1" },
    { "title": "test title 2", "description": "test description 2" },
    { "title": "test title 3", "description": "test description 3" },
    { "title": "test title 4", "description": "test description 4" },
]

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.post('/notes', (req, res) => {
    notes.push(req.body);
    res.send('note added successfully');
})

app.get('/notes', (req, res) => {
    res.send(notes);
})

app.delete('/notes/:index', (req, res) => {
    let { index } = req.params;
    index = parseInt(index);
    // notes.splice(index, 1);
    delete notes[index];
    res.send('note deleted successfully');
})

app.patch('/notes/:index', (req, res) => {
    let { index } = req.params;
    index = parseInt(index);
    notes[index].description = req.body.description;
    res.send('note updated successfully');
})

module.exports = app;