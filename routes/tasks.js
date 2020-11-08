var express = require("express");
var router = express.Router();
var models = require("../models");
var authService = require('../services/auth');

/* GET tasks */
router.get("/", (req, res, next) => {
  let token = req.cookies.token;
  authService.verifyUser(token).then((user) => {
    if (!user) {
      return res.json({ message: "Not logged in." });
    }
    models.tasks
      .findAll({
        where: { ownedBy: user.UserId },
        attributes: ["TaskId", "TaskName", "Completed"],
      })
      .then((tasksFound) => {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(tasksFound));
      });
  });
});

/* GET task by ID */
router.get("/:id", (req, res) => {
  let token = req.cookies.token;
  authService.verifyUser(token).then((user) => {
    if (!user) {
      return res.json({ message: "Not logged in." });
    }
    models.tasks
      .findOne({
        where: {
          TaskId: parseInt(req.params.id),
          ownedBy: user.UserId,
        },
      })
      .catch((err) => {
        res.json({ message: "No task with that id.", status: 200 });
      })
      .then((taskFound) => {
        res.json({ task: taskFound, status: 200 });
      });
  });
});

/* Post new task */
router.post('/add', (req, res) =>{
  let token = req.cookies.token;
  authService.verifyUser(token).then(user => {
    if(user == null){
      return res.json({message: "User not logged on."})
    }
    models.taks.create({...req.body, ownedBy: user.id}).then(newTask =>{
      res.json({task: newTask});

    }).catch(err => {
      res.status(400);
      res.send(err.message);
    });
  });
});

/* Update task by id.*/
router.put("/:id", (req, res) => {
  let token = req.cookies.token;
  authService.verifyUser(token).then((user) => {
    if (!user) {
      return res.json({ message: "Not logged in." });
    }
    models.tasks
      .update(req.body, {
        where: {
          TaskId: parseInt(req.params.id),
          ownedBy: user.UserId,
        },
      })
      .catch((err) => {
        res.status(400);
        res.json({ message: "There was a problem editing the task!" });
      })
      .then((taskFound) => {
        res.json({ task: taskFound });
        res.status(200);
      });
  });
});

/* Delete task by id.*/
router.delete("/:id", (req, res) => {
  let token = req.cookies.token;
  authService.verifyUser(token).then((user) => {
    if (!user) {
      return res.json({ message: "Not logged in." });
    }
    models.tasks
      .destroy({
        where: {
          TaskId: parseInt(req.params.id),
          ownedBy: user.UserId,
        },
      })
      .then((result) => res.redirect("/tasks"))
      .catch((err) => {
        res.status(400);
        res.json({ message: "There was a problem deleting the task!" });
      });
  });
});

module.exports = router;
