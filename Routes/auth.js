const router = require("express").Router();
const User = require("../model/User");
const bodyParser = require("body-parser");
const { loginValication, registerValication } = require("./validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("./VerifyToken");

// create application/json parser USE FOLLOWING INSTEAD OF app.use(express.json()); in index.js
// var jsonParser = bodyParser.json(); // for JSON data from req body
// var urlencodedParser = bodyParser.urlencoded({ extended: false }); //for URL params from URl

router.get("/dummy", verifyToken, async (req, res) => {
	//Set header as "auth-token" and the value(token) will be added with header of POST:/login
  res.send("dummy working");
});

router.post("/register", async (req, res) => {
  //Validation
  //(used follwoing command for Joi.validate the latest version throws function undefiened error)
  // npm uninstall --save @hapi/joi
  // npm install --save @hapi/joi@15.0.3
  const validation = registerValication(req.body);
  if (validation.error) {
    res.status(400).send(validation.error.details[0].message);
  } else {
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
      res.status(400).send("Email Already There");
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });
      try {
        user.save();
        res.send({ user: user.id });
      } catch (err) {
        res.status(400).send(err);
      }
    }
  }
});

router.post("/login", async (req, res) => {
  const validation = loginValication(req.body);
  if (validation.error) {
    res.status(400).send(validation.error.details[0].message);
  } else {
    const userInstance = await User.findOne({ email: req.body.email });

    if (!userInstance) {
      res.status(400).send("User Email Not Valid");
    } else {
      //validating passworrd
      const validPassword = await bcrypt.compare(
        req.body.password,
        userInstance.password
      );
      if (!validPassword) {
        res.status(400).send("User Password Not Valid");
      } else {
        // creating token
        const token = jwt.sign(
          { _id: userInstance._id },
          process.env.TOKEN_SECERT
        );
        res.header("auth-token", token).send("User Password Valid!!!!");
      }
    }
  }
});

module.exports = router;
