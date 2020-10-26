var express = require("express");
var router = express.Router();
var models = require("../models");

/* GET tasks. WIP */
router.get("/", (req, res, next) => {
    models.tasks
    .findAll({
        attributes: ['TaskId', 'TaskName']
    })
    .then(tasksFound => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(tasksFound));
    });
  });

  module.exports = router;