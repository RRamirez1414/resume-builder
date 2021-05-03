const express = require('express')
const router = express.Router()
const User = require("../models/user");

//'host/home/:username'
router.get("/:username", (req, res) => {
    res.render('home/home')
  });

module.exports = router;