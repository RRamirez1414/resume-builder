const express = require('express')
const router = express.Router()
const User = require('../models/user')
const ResumeInfo = require('../models/resumeInfo')
const States = require('../models/states')
const Months = require('../models/months')
const Educations = require('../models/education')
const Experiences = require('../models/experience')

let loggedUser = {}

//host/user/:username
router.get('/:username', (req, res) => {
  const username = req.params.username
  User.findOne({ username: username }, (error, foundUser) => {
    if (!error) {
      loggedUser = foundUser
      res.render('home/home', {
        username: loggedUser.username,
        fname: loggedUser.firstName,
      })
    }
  })
})

//host/user/:username/new-form
router.get('/:username/new-form', async (req, res) => {
  let states = await States.find({})
  let months = await Months.find({})
  res.render('user/new-website-form', { states: states, months: months })
})

//host/user/:username/view-list
router.get('/:username/view-list', async (req, res) => {
  let resumeList = await ResumeInfo.find({ user: loggedUser._id })
  res.render('home/viewResumeList', { resumeList: resumeList })
})

//host/user/:username/view-list/:resumeid
router.get('/:username/view-list/:resumeid', async (req, res) => {
  let resumeId = req.params.resumeid
  
  //single resume comes back
  let resume = await ResumeInfo.find({
    user: loggedUser._id,
    _id: resumeId,
  })

  let states = await States.find({})
  let months = await Months.find({})
  let educationList = await Educations.find({resumeInfo: resumeId})
  let experienceList = await Experiences.find({resumeInfo: resumeId})

  res.render('user/edit-resume-form', {
    username: loggedUser._id,
    resume: resume[0],
    states: states,
    months: months,
    educationList: educationList,
    experienceList: experienceList
  }) 
  res.sendFile('../public/scripts/injection-scripts/injection-form.js')
})

//generated website end point
router.get('/page/:username', (req, res) => {
  const username = req.params.username
  User.findOne(
    {
      /** find user by username from route
       * later, do another get request to handle multiple websites of the same user
       * something like /:username/:website-title
       */
      username: loggedUser.username,
    },
    (err, foundUser) => {
      if (!err) {
        firstName = foundUser.firstName
        //render the user's website through ejs
        res.render('user/user-website', {
          firstName: firstName,
          bio: loggedUser.bio,
        })
      } else {
        //alert the user the website has not been found
        alert('web page not found!')
      }
    }
  )
})
// router.post('/delete-resume', () => {})

//host/user/confirm-edits, handle resume edits
router.post('/confirm-edits', (req, res) => {
  //gather form values and change accordingly in resumeInfo db, redirect to list
  console.log(req.body)
  res.redirect(`${loggedUser.username}/view-list`)
})

router.post('/create-website', (req, res) => {
  //RR:
  //change route to create-website, update
  //handle form data from url req body, create and to resumeInfo DB
  //don't store to logged user
  loggedUser.bio = req.body.personalBio

  //? app claims cannot read property of first name on database of null but still loads the document anyway?
  res.redirect('/user/page/' + loggedUser.username)
})

module.exports = router
