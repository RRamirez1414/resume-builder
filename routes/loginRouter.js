const express = require('express')
const router = express.Router()
const userModel = require('../models/user')


//'host/login'
router.get("/", (req, res) => {
    res.render("login/login");
  });

//check login, redirect to home if successful, redirect to login failed route otherwise
router.post('/', (req, res) => {
    username = req.body.username
    userPassword = req.body.password

    userModel.findOne({username: username},(error, foundUser) => {
        if(!error) {
            if(userPassword === foundUser.password) {
                //successful login, redirect to home
                res.redirect(`/user/${foundUser.username}`)
            }
            else {
                res.render("login/loginFailed")
            }
        } else {
            res.render("login/loginFailed")
        }   
    })
})

module.exports = router;