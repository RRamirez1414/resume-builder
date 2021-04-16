const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./models/user')

//initialization and middleware
const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: 'true' }))

//mongoose database connection
const uri = "mongodb+srv://admin:ILOyL5Wzxs7UbdDk@webdev.2jqbv.mongodb.net/RESUME_DB?retryWrites=true&w=majority";
try {
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
} catch (error) {
    handleError(error);
}

//create test users
// const NewUser = new User({
//     firstName: "Hecmar",
//     lastName: "Arreola",
//     username: "harreolanmsu",
//     password: "password2"
// })

// console.log(NewUser);
// // NewUser.save()

const db = mongoose.connection
db.on('error', error => console.error(error));
db.once('open', () => console.log("Connected to Mongoose"));

app.get("/", (req, res) => {
    res.render('home')
})

app.get("/new-form", (req, res) => {
    res.render('new-form')
})

//RR: create a get request to handle user id as a url paramater
//this link is the user's website

app.post("/new-form", (req, res) => {
    //RR: 
    //handle form data from url body info, store to DB
    //render new link with user id  from DB as a path
    //also store link to a collection of websites (could be an array) to DB

})

app.listen(3000, () => {
    console.log("Server started on port 3000");
})
