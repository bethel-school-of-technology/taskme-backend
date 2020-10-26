var express = require("express");
var router = express.Router();
var models = require("../models");

/* GET tasks. WIP */
router.get("/", (req, res, next) => {
    models.lists
    .findAll({
        attributes: ['ListId', 'ListName']
    })
    .then(listsFound => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(listsFound));
    });
  });

  module.exports = router;