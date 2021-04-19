const express = require("express");
const router = express.Router();
const User = require("../models/user");

//later, will be dynamically filled upon successful login
const loggedUser = {
  username: "ramirez.ramon",
  bio: "",
};

router.get("/new-form", (req, res) => {
  res.render("user/new-website-form");
});

router.get("/page/:username", (req, res) => {
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
        console.log(firstName);
        //render the user's website through ejs
        res.render("user/user-website", {
          firstName: firstName,
          bio: loggedUser.bio,
        });
      } else {
        //alert the user the website has not been found
        alert("web page not found!");
      }
    }
  );
});

router.post("/create-website", (req, res) => {
  //RR:
  //handle form data from url body info, store to DB
  //render new link with user id or username from DB as a path
  //for later, also store link to a collection of website links to DB tied to the user
  loggedUser.bio = req.body.personalBio;

  console.log("post successful");

  //? app claims cannot read property of first name on database of null but still loads the document anyway?
  res.redirect("/user/page/" + loggedUser.username);
});

module.exports = router;