import sequelize from "../config/sequelizeConfig.js";
import { Model, DataTypes } from "sequelize";
import { estateModel } from "./estateModel.js";
import { userModel } from "./userModel.js";

export class favouriteModel extends Model {}

favouriteModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: userModel,
        key: "id",
      },
    },
    estate_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: estateModel,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "favorites",
    underscored: true, 
    freezeTableName: true, 
    createdAt: true, 
    updatedAt: true, 
  }
);
