const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.get("/new-form", (req, res) => {
    res.render('new-form');
  });
  
  //RR: create a get request to handle user id as a url paramater
  //this link is the user's website
  router.get('/:username', (req, res) => {
    const username = req.params.username;
    User.findOne(
      {
        /** find user by username from route
         * later, do another get request to handle multiple websites of the same user
         * something like /:username/:website-title
         */
        username: username,
      },
      (err, foundUser) => {
        if (!err) {
          firstName = foundUser.firstName;
          // //render the user's website through ejs
          res.render("user/user-website", {
            firstName: firstName,
          });
        } else {
          //alert the user the website has not been found
          alert("web page not found!");
        }
      }
    );
  });
  
  router.post("/new-form", (req, res) => {
    //RR:
    //handle form data from url body info, store to DB
    //render new link with user id or username from DB as a path
    //for later, also store link to a collection of websites to DB tied to the user
  });

module.exports = router;