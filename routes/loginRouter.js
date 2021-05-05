const express = require('express')
const router = express.Router()
const userModel = require('../models/user')


//'host/login/'
router.get("/", (req, res) => {
    res.render("login/login");
  });

//check login, redirect to home if successful, redirect to login failed route otherwise
router.post('/', (req, res) => {
    console.log(req.body)

    //check which button was clicked
    if(req.body.submitButton === "login") {
        //user has pressed login button
        username = req.body.loginUsername
        userPassword = req.body.loginPassword

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
    } else if(req.body.submitButton === "signup") {
        //user has pressed signup button
        fname = req.body.signupFirstname
        lname = req.body.signupLastname
        username = req.body.signupUsername
        password = req.body.signupPassword

        userModel.create({firstName: fname, lastName: lname, username: username, password: password }, (err, createdUser) => {
            if(!err) {
                res.redirect(`/user/${createdUser.username}`)
            } else {
                //handle error
            }
        })


    } else {
        res.render("login/loginFailed")
    }
    
})

module.exports = router;