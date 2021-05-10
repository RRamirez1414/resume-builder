const express = require('express')
const router = express.Router()
const User = require('../models/user')
const ResumeInfo = require('../models/resumeInfo')
const States = require('../models/states')
const Months = require('../models/months')
const Educations = require('../models/education')
const Experiences = require('../models/experience')

//fields get filled based on userModel
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

router.get('/:username/sample', (req, res) => {
  res.render('user/sample')
});

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
  let skills = resume[0]['skills'].split(",")

  res.render('user/edit-resume-form', {
    username: loggedUser._id,
    resume: resume[0],
    skills: skills,
    states: states,
    months: months,
    educationList: educationList,
    experienceList: experienceList
  }) 
})

//host/user/:username/view-website-list/
router.get('/:username/view-website-list', async (req, res) => {
  let websiteList = await ResumeInfo.find({ user: loggedUser._id })
  res.render('home/viewWebsiteList', { websiteList: websiteList })
})

router.get('/:username/view-website-list/:resumeid', async (req, res) => {
  let resumeId = req.params.resumeid
  
  //single resume comes back
  let websiteInfo = await ResumeInfo.findOne({
    user: loggedUser._id,
    _id: resumeId,
  })

  console.log(websiteInfo);

  res.render('user/user-website', {
    userfn: loggedUser.firstName,
    skills: websiteInfo.skills,
    profSum: websiteInfo.profSum
  })
})

// router.post('/delete-resume', () => {})

//host/user/confirm-edits, handle resume edits
router.post('/confirm-edits', async (req, res) => {
  const user = await User.findById(req.body.userID);
  updateResumeInfo(req.body);
  // console.log([user.username, req.body.resumeID]);
  res.redirect(`/user/${user.username}/view-list/${req.body.resumeID}`)
  // saveEducationInfo(req.body, resumeID);
  // saveExperienceInfo(req.body, resumeID);
  // res.redirect(`${loggedUser.username}/view-list`)
})

router.post('/save-resume', async (req, res) => {
  const resumeID = await saveResumeInfo(req.body);
  saveEducationInfo(req.body, resumeID);
  saveExperienceInfo(req.body, resumeID);
  res.redirect(`/user/${req.body.username}/view-list/${resumeID}`)
  res.send("save complete");
});

async function updateResumeInfo(reqBody, resumeID){
  const info = reqBody;
  console.log(info);
  let resumeInfo;
  try {
    resumeInfo = await ResumeInfo.findById(info.resumeID);
    resumeInfo.siteTitle = info.siteTitle;
    resumeInfo.address = info.address;
    resumeInfo.phone1Type = info.phone1Type;
    resumeInfo.phone2Type = info.phone2Type;
    resumeInfo.phone1 = info.phone1;
    resumeInfo.phone2 = info.phone2;
    resumeInfo.link1 = info.link1;
    resumeInfo.link2 = info.link2;
    resumeInfo.email1 = info.email1;
    resumeInfo.email2 = info.email2;
    resumeInfo.profSum = info.profSum;
    if(info.Skills != null && info.Skills.length > 1 && info.Skills.length != 0){
      resumeInfo.skills = "";
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
    resumeInfo.save();
    console.log("Current Resume being updated\n" +resumeInfo);
  } catch (error) {
    console.log("error updating resume info");
    console.log(error);
  }
}

async function saveExperienceInfo(reqBody, resumeID){
  const info = reqBody;
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
  console.log(info);
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
