var express = require("express");
var router = express.Router();
var models = require("../models");
var authService = require('../services/auth');
/* GET tasks. WIP */
router.get("/", (req, res, next) => {
  models.tasks
    .findAll({
      attributes: ["TaskId", "TaskName"],
    })
    .then((tasksFound) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(tasksFound));
    });
});

/* GET task by ID */
router.get("/:id", (req, res) => {
    models.tasks
    .findOne({
      where: {
        id: parseInt(req.params.id)
        // ownedBy: user.id,
      },
    })
    .catch(err => {
        res.status(400);
        res.send("No task with that id");
    })
    .then((taskFound) => {
      res.json({ task: taskFound });
      res.status(200);
    });
});

router.post ('/add', (req, res) =>{
  let token =req.cookies.token;
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
module.exports = router;
