const express = require('express')
const router = express.Router()
const User = require('../models/user')
const ResumeInfo = require('../models/resumeInfo')
const States = require('../models/states')
const Months = require('../models/months')
const Education = require('../models/education')
const Experience = require('../models/experience')

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
  const resumeID = await saveResumeInfo(req.body);
  saveEducationInfo(req.body, resumeID);
  saveExperienceInfo(req.body, resumeID);
  res.redirect(`/user/${req.body.username}/view-list/${resumeID}`)
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

async function saveExperienceInfo(reqBody, resumeID){
  const info = reqBody;
  // console.log(reqBody);
  //logic checks if any experience was passed and if not does not create in database
  if(info.expName.length != null && info.expName.length > 1 && info.expName.length != 0){
    info.expName.forEach(async (exp, idx, array) => {
      let experience = new Experience({
        resumeInfo: resumeID, 
        expName: exp,
        deptName: "",
        title: info.title[idx],
        description: info.description[idx],
        jobDuties: info.jobDuties[idx],
        fromMonth: info.fromMonth[idx],
        fromYear: info.fromYear[idx],
        toMonth: info.toMonth[idx],
        toYear: info.toYear[idx],
        city: info.expCity[idx],
        state: info.expState[idx].trim()
      });
      try {
        const newExperience = await experience.save();
      } catch (error) {
        console.log("error saving education " + idx)
        console.log(error);
      }
      // console.log(experience);
    });
  } else if(info.expName.length != null && info.expName.length == 1){
    let experience = new Experience({
      resumeInfo: resumeID, 
      expName: info.expName,
      deptName: "",
      title: info.title,
      description: info.description,
      jobDuties: info.jobDuties,
      fromMonth: info.fromMonth,
      fromYear: info.fromYear,
      toMonth: info.toMonth,
      toYear: info.toYear,
      city: info.expCity,
      state: info.expState.trim()
    });
    try {
      const NewExperience = await experience.save();
    } catch (error) {
      console.log("error saving experience ")
      console.log(error);
    }
    // console.log(experience)
  }
  
}

async function saveEducationInfo(reqBody, resumeID){
  const info = reqBody;
  // console.log(reqBody);
  if(info.institution.length != null && info.institution.length > 1 && info.institution.length != 0){
    info.institution.forEach(async (inst, idx, array) => {
      let education = new Education({
        resumeInfo: resumeID, 
        institution: inst,
        achieved: info.achieved[idx],
        program: info.program[idx],
        gradYear: info.gradYear[idx],
        graduated: info.graduated[idx],
        city: info.city[idx],
        state: info.state[idx].trim()
      });
      try {
        const newEducation = await education.save();
      } catch (error) {
        console.log("error saving education " + idx)
        console.log(error);
      }
    });
  } else if(info.institution.length != null && info.institution.length == 1){
      let education = new Education({
        resumeInfo: resumeID, 
        institution: info.institution,
        achieved: info.achieved,
        program: info.program,
        gradYear: info.gradYear,
        graduated: info.graduated,
        city: info.city,
        state: info.state.trim()
      });
      try {
        const newEducation = await education.save();
      } catch (error) {
        console.log("error saving education ")
        console.log(error);
      }
  }
  
}

async function saveResumeInfo(reqBody){
  const info = reqBody;
  const userID = await User.findOne({username: info.username.trim()});
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
  if(info.Skills != null && info.Skills.length > 1 && info.Skills.length != 0){
    info.Skills.forEach((skill, idx, array) => {
      if(idx === array.length - 1){
        resumeInfo.skills += skill;
      } else{
        resumeInfo.skills += skill + ",";
      }
    });
  } else if(info.Skills != null && info.Skills.length == 1){
    resumeInfo.skills = info.Skills;
  }
  
  // console.log(resumeInfo);
  try {
    const newResumeInfo = await resumeInfo.save();
  } catch (error) {
    console.log("error saving resumeInfo")
    console.log(error);
  }
  return resumeInfo._id;
}

module.exports = router
