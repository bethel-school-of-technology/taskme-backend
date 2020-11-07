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
        TaskId: parseInt(req.params.id)
        // ownedBy: user.id,
      },
    })
    .catch(err => {
        res.status(400);
        res.send("No task with that id");
    })
    .then((taskFound) => {
      res.json({ task: taskFound, status: 200 });
    });
});

/* Update task by id.*/
router.put("/:id", (req, res) => {
    models.tasks
      .update(req.body, {
        where: {
          TaskId: parseInt(req.params.id)
        }
      })
      .catch(err => {
        res.status(400);
        res.send("There was a problem updating the task");
      })
      .then((taskFound) => {
        res.json({ task: taskFound });
        res.status(200);
      })
});

/* Delete task by id.*/
router.delete("/:id", (req, res) => {
    models.tasks
      .destroy({
        where: {
          TaskId: parseInt(req.params.id)
        }
      })
      .then(result => 
        res.redirect('/tasks')
      )
      .catch(err => {
        res.status(400)
        res.send("There was a problem deleting the task")
      })
});

module.exports = router;
