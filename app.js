const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')

//initialization and middleware
const app = express()
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: 'true' }))

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