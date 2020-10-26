var express = require("express");
var router = express.Router();
var models = require("../models");

/* GET lists. WIP */
router.get("/", (req, res, next) => {
  models.lists
    .findAll({
      attributes: ["ListId", "ListName"],
    })
    .then((listsFound) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(listsFound));
    });
});

/* Find list by ID */
router.get("/:id", (req, res) => {
  models.lists
    .findOne({
      where: {
        id: parseInt(req.params.id),
        // ownedBy: user.id,
      },
    })
    .catch((err) => {
      res.status(400);
      res.send("No list with that id");
    })
    .then((listFound) => {
      res.json({ list: listFound });
      res.status(200);
    });
});

module.exports = router;
