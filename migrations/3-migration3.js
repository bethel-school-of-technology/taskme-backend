'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "lists", deps: []
 *
 **/

var info = {
    "revision": 3,
    "name": "migration3",
    "created": "2020-10-25T01:13:22.377Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "createTable",
    params: [
        "lists",
        {
            "ListId": {
                "type": Sequelize.INTEGER,
                "field": "ListId",
                "primaryKey": true,
                "autoIncrement": true,
                "allowNull": false
            },
            "ListName": {
                "type": Sequelize.STRING,
                "field": "ListName"
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "field": "createdAt",
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "field": "updatedAt",
                "allowNull": false
            }
        },
        {}
    ]
}];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
