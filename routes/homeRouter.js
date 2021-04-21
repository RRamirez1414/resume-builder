const express = require('express')
const router = express.Router()
const User = require("../models/user");

router.get("/", (req, res) => {
  //TODO: later, when sign in gets set up, redirect user to login/sign up page if not signed in
    res.redirect("/home");
  });

router.get("/home", (req, res) => {
  res.render("home/home")
})

module.exports = router;