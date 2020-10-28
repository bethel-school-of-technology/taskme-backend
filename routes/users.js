var express = require("express");
var router = express.Router();
var models = require("../models");
var authService = require("../services/auth");

router.post("/token", function (req, res, next) {
  let token = req.cookies.token;

  if (!token) {
    res.json({ user: null, token: null });
    return;
  }
  authService.verifyUser(token).then((user) => {
    if (!user) {
      res.json({ user: null, token: null });
    }

    let token = authService.signUser(user);
    res.cookie("token", token, { httpOnly: true });
    res.json({ user, token });
  });
});

// Create new user if one doesn't exist
router.post("/signup", async (req, res, next) => {
  console.log(req.body);
  const [result, created] = await models.users.findOrCreate({
    where: {
      Email: req.body.email,
    },
    defaults: {
      Username: req.body.username,
      Password: authService.hashPassword(req.body.password),
      FirstName: req.body.lastName,
      LastName: req.body.firstName,
    },
  });
  // console.log(result); 
  console.log(created); 
  if (created) {
    res.json({ message: "User successfully created", created });
  } else {
    res.json({ message: "This user already exists" });
  }
});

// Login user and return JWT as cookie
router.post("/login", (req, res, next) => {
  console.log(req.body);
  models.users
    .findOne({
      where: {
        Email: req.body.email,
      },
    })
    .then((user) => {
      console.log(user);
      if (!user) {
        console.log("User not found");
        return res.status(400).json({
          message: "Login failed, did not match any records.",
        });
      } else {
        let passwordMatch = authService.comparePasswords(
          req.body.password,
          user.Password
        );
        if (passwordMatch) {
          let token = authService.signUser(user);
          res.cookie("token", token, { httpOnly: true });
          res.status(200).json({ user, token, message: "Logged In" });
        } else {
          res.status(400).json({
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
    res.json({ message: "This is not your profile" });
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
  res.cookie("token", "", { expires: new Date(0) });
  res.json({ message: "Logged out" });
});

module.exports = router;
