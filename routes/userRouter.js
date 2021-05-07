const express = require('express')
const router = express.Router()
const User = require('../models/user')
const ResumeInfo = require('../models/resumeInfo')
const States = require('../models/states')
const Months = require('../models/months')

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
  res.render('user/new-website-form', { states: states, months: months, username: req.params.username})
})

//host/user/:username/view-list
router.get('/:username/view-list', async (req, res) => {
  let resumeList = await ResumeInfo.find({ user: loggedUser._id })
  res.render('home/viewResumeList', { resumeList: resumeList })
})

//host/user/:username/view-list/:resumeid
router.get('/:username/view-list/:resumeid', async (req, res) => {
  let resume = await ResumeInfo.find({
    user: loggedUser._id,
    _id: req.params.resumeid,
  })
  res.render('user/edit-resume-form', {
    username: loggedUser._id,
    resume: resume[0],
  })
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

router.post('/save-resume', async (req, res) => {
  const userID = await User.findOne({username: req.body.username.trim()});
  const info = req.body;
  const resumeInfo = new ResumeInfo({
    user: userID['_id'],
    siteTitle: info.siteTitle,
    address: info.address,
    phone1Type: info.phone1Type,
    phone2Type: info.phone2Type,
    phone1: info.phone1,
    phone2: info.phone2,
    link1: info.link1,
    link2: info.link2,
    email1: info.email1,
    email2: info.email2,
    profSum: info.profSum,
    skills: ""
  });
  info.Skills.forEach((skill, idx, array) => {
    if(idx === array.length - 1){
      resumeInfo.skills += skill;
    } else{
      resumeInfo.skills += skill + ",";
    }
  });
  console.log(resumeInfo);
  try {
    const newResumeInfo = await resumeInfo.save();
  } catch (error) {
    console.log("error saving resumeInfo")
    console.log(error);
  }
  res.send("save complete");
});

router.post('/create-website', (req, res) => {
  res.send(req.body);
  //RR:
  //change route to create-website, update
  //handle form data from url req body, create and to resumeInfo DB
  //don't store to logged user
  loggedUser.bio = req.body.personalBio

  //? app claims cannot read property of first name on database of null but still loads the document anyway?
  res.redirect('/user/page/' + loggedUser.username)
})

module.exports = router
