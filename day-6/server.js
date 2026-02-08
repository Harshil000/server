const app = require('./src/app');
const mongoose = require('mongoose');

function connectToDB() {
    mongoose.connect("mongodb+srv://auser:auser@cluster0.zuu4zru.mongodb.net/day-6")
    .then(() => {console.log("connected to DB")})
    .catch((err) => {console.log(err)});
}

connectToDB();

app.listen(3000 , () => {
    console.log("server listening on localhost:3000");
})