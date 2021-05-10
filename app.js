const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const User = require('./models/user')
const homeRouter = require('./routes/homeRouter.js')
const userRouter = require('./routes/userRouter.js')
const loginRouter = require('./routes/loginRouter.js')
const queryRouter = require('./routes/queryRouter')
const resumeInfo = require('./models/resumeInfo')
const education = require('./models/education')
const experience = require('./models/experience')

//initialization and middleware
const app = express()

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(path.join(__dirname, '/public')))
app.use(bodyParser.urlencoded({ extended: 'true' }))

//mongoose database connection
const uri =
  'mongodb+srv://admin:ILOyL5Wzxs7UbdDk@webdev.2jqbv.mongodb.net/RESUME_DB?retryWrites=true&w=majority'
try {
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
} catch (error) {
  handleError(error)
}

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/user', userRouter)
app.use('/login', loginRouter)
app.use('/query', queryRouter)

app.get('/', (req, res) => {
  res.redirect('/login')
})
//create test users
// const NewUser = new User({
//     firstName: "Hecmar",
//     lastName: "Arreola",
//     username: "harreolanmsu",
//     password: "password2"
// })

// console.log(NewUser);
// NewUser.save()

//create test resumeInfo
// const NewResumeInfo = new resumeInfo({
//     user: "607a06312995110efc4952d9", //user 607a06312995110efc4952d9 ID
//     siteTitle: "harreolanmsu-resume",
//     address: "1234 Everywhere Dr. Las Cruces, NM",
//     phone1Type: "Mobile",
//     phone2Type: "Home",
//     phone1: "123-456-7890",
//     phone2: "(123) 456-7890",
//     link1: "linkedin.com/harreolanmsu",
//     link2: "github.com/harreolanmsu",
//     email1: "harreolanmsu@gmail.com",
//     email2: "harreolanmsu@nmsu.edu",
//     profSum: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//     skills: "PHP,Github,GitLab,CSS3,HTML5,C,C++,Java,MongoDB,React,Vue JS"
// });
// console.log(NewResumeInfo);
// NewResumeInfo.save();

//create test education
// const NewEducation = new education({
//   resumeInfo: "608d96e80cb5409308baa2e1", //user alvarezrvn resumeInfo ID
//   institution: "New Mexico State University (NMSU)",
//   achieved: "BA",
//   program: "Psychology",
//   gradYear: 2020,
//   graduated: "Y",
//   city: "Las Cruces",
//   state: "NM"
// });
// console.log(NewEducation);
// NewEducation.save();

//create test Experience
// const NewExperience = new experience({
//   resumeInfo: "608d96e80cb5409308baa2e1", //user alvarezrvn resumeInfo ID
//   expName: "New Mexico State Univesity",
//   deptName: "Student Information Management",
//   title: "Student Assistant",
//   description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed vulputate odio ut enim blandit.",
//   jobDuties: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed;Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed;Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed;Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed;Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed;Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed",
//   fromMonth: "Oct",
//   fromYear: 2019,
//   toMonth: "Jan",
//   toYear: 2020,
//   city: "Las Cruces",
//   state: "NM"
// });
// console.log(NewExperience);
// NewExperience.save();

app.listen(process.env.PORT || 3000, () => {
  console.log('Server started on port')
})
