const express = require('express')
const app = express()
const noteModel = require('./models/notes.model')

app.use(express.json())

app.get('/' , (req , res) => {
    res.send('Hello World')
})

app.get('/notes' , async(req , res) => {
    const notes = await noteModel.find()
    res.status(200).json({
        "message" : "Notes fetched successfully",
        "notes" : notes
    })
})

app.post ('/notes' , async(req , res) => {
    await noteModel.create(req.body)
    res.status(201).send({
        "message" : "Note created successfully",
        "note" : req.body
    })
})

module.exports = app