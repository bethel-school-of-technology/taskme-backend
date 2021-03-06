"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const users = require("./users");
  class tasks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tasks.belongsTo(models.users, {
        foreignKey: "UserId",
      });
    }
  }
  tasks.init(
    {
      TaskId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      TaskName: DataTypes.STRING,
      Completed: DataTypes.BOOLEAN,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      UserId: {
        type: DataTypes.INTEGER,
        // references: {
        //   model: users,
        //   key: "UserId",
        // },
      },
    },
    {
      sequelize,
      modelName: "tasks",
    }
  );
  return tasks;
};
