var express = require("express");
var router = express.Router();
var models = require("../models");

/* GET tasks. WIP */
router.get("/", (req, res, next) => {
  models.tasks
    .findAll({
      attributes: ["TaskId", "TaskName", "Completed"],
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

module.exports = router;
