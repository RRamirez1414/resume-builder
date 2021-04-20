const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/user");
const homeRouter = require("./routes/homeRouter.js");
const userRouter = require("./routes/userRouter.js");

//initialization and middleware
const app = express();

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: "true" }));

//mongoose database connection
const uri =
  "mongodb+srv://admin:ILOyL5Wzxs7UbdDk@webdev.2jqbv.mongodb.net/RESUME_DB?retryWrites=true&w=majority";
try {
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
} catch (error) {
  handleError(error);
}

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Mongoose"));

app.use("/", homeRouter);
app.use("/user", userRouter);

//create test users
// const NewUser = new User({
//     firstName: "Hecmar",
//     lastName: "Arreola",
//     username: "harreolanmsu",
//     password: "password2"
// })

// console.log(NewUser);
// NewUser.save()

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
