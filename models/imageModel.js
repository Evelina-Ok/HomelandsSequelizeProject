import sequelize from "../config/sequelizeConfig.js";
import { DataTypes, Model } from "sequelize";

export class imageModel extends Model {}

imageModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "images",
    underscored: true,
    freezeTableName: true,
    createdAt: true,
    updatedAt: true,
  }
);