const express = require('express')
const router = express.Router()

//'host/home/:username'
router.get("/:username", (req, res) => {
    res.render('home/home')
  });

module.exports = router;