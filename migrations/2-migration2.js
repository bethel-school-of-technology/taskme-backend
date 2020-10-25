'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "tasks", deps: []
 *
 **/

var info = {
    "revision": 2,
    "name": "migration2",
    "created": "2020-10-25T01:08:30.916Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "createTable",
    params: [
        "tasks",
        {
            "TaskId": {
                "type": Sequelize.INTEGER,
                "field": "TaskId",
                "primaryKey": true,
                "autoIncrement": true,
                "allowNull": false
            },
            "TaskName": {
                "type": Sequelize.STRING,
                "field": "TaskName"
            },
            "Completed": {
                "type": Sequelize.BOOLEAN,
                "field": "Completed"
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "field": "createdAt"
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "field": "updatedAt"
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
