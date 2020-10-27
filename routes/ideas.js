var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res, next) => {
  models.ideas
    .findAll({
      attributes: ["IdeasId", "IdeaName"],
    })
    .then((ideasFound) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(ideasFound));
    });
});

/* Find list by ID */
router.get("/:id", (req, res) => {
  models.ideas
    .findOne({
      where: {
        id: parseInt(req.params.id),
        // ownedBy: user.id,
      },
    })
    .catch((err) => {
      res.status(400);
      res.send("No ideas with that id");
    })
    .then((ideaFound) => {
      res.json({ list: ideaFound });
      res.status(200);
    });
});

module.exports = router;
