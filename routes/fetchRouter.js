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

router.get('/get-months', async (req, res) => {
  let months = await Months.find({})
  res.send(JSON.stringify(months))
})

module.exports = router
