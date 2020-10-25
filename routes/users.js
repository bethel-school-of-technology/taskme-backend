var express = require("express");
var router = express.Router();
var models = require("../models");
var authService = require("../services/auth");

/* GET users listing. */
router.get("/", (req, res, next) => {
  res.json({message: "respond with a resource"});
});

// Create new user if one doesn't exist
router.post("/signup", (req, res, next) => {
  models.users
    .findOrCreate({
      where: {
        Username: req.body.username,
      },
      defaults: {
        FirstName: req.body.firstName,
        LastName: req.body.lastName,
        Email: req.body.email,
        Password: authService.hashPassword(req.body.password),
      },
    })
    .spread(function (result, created) {
      if (created) {
      res.json({ message: "User successfully created"});
      } else {
        res.json({ message: "This user already exists"});
      }
    });
});

// Login user and return JWT as cookie
router.post("/login", (req, res, next) => {
  models.users
    .findOne({
      where: {
        Username: req.body.username,
      },
    })
    .then((user) => {
      if (!user) {
        console.log("User not found");
        return res.status(401).json({
          message: "Login failed, did not match any records.",
        });
      } else {
        let passwordMatch = authService.comparePasswords(
          req.body.password,
          user.Password
        );
        if (passwordMatch) {
          let token = authService.signUser(user);
          res.cookie("jwt", token, { httpOnly: true });
          res.json({ user, token });
        } else {
          res.json({
            message: "Email and Password did not match any records.",
          });
        }
      }
    });
});

router.get("/profile", (req, res, next) => {
  let token = req.cookies.jwt;
  if (token) {
    authService.verifyUser(token).then((user) => {
      if (user) {
        res.send(JSON.stringify(user));
      } else {
        res.status(401);
        res.json({ message: "Invalid authentication token" });
      }
    });
  } else {
    res.status(401);
    res.json({ message: "Must be logged in" });
  }
});

router.get("/profile/:id", authService.verifyUser, (req, res, next) => {
  // if (!req.isAuthenticated()) {
  //   return res.send('You are not authenticated');
  // }
  if (req.params.id !== String(req.user.UserId)) {
    res.json({ message: "This is not your profile"});
  } else {
    let status;
    if (req.user.Admin) {
      status = "Admin";
    } else {
      status = "Normal user";
    }

    res.json({
      FirstName: req.user.FirstName,
      LastName: req.user.LastName,
      Email: req.user.Email,
      UserId: req.user.UserId,
      Username: req.user.Username,
      Status: status,
    });
  }
});

router.get("/logout", (req, res, next) => {
  res.cookie("jwt", "", { expires: new Date(0) });
  res.json({ message: "Logged out" });
});

module.exports = router;
