const express = require('express')
const router = express.Router()
const userModel = require('../models/user')
const ResumeInfo = require('../models/resumeInfo')
const States = require('../models/states')
const Months = require('../models/months')
const Educations = require('../models/education')
const Experiences = require('../models/experience')

router.get('/get-states', async (req, res) => {
  let states = await States.find({})
  res.send(JSON.stringify(states))
})

module.exports = router
