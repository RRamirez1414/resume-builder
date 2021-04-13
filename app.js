const express = require('express')
const ejs = require('ejs')

//initialization and middleware
const app = express()
app.set('view engine', 'ejs')

app.get("/", (req, res) => {
    res.render('home')
})

app.get("/new-form", (req, res) => {
    res.render('new-form')
})

app.listen(3000, () => {
    console.log("Server started on port 3000");
})
