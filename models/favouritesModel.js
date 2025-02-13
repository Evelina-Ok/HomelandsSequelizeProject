import sequelize from "../config/sequelizeConfig.js";
import { Model, DataTypes } from "sequelize";
export class cityModel extends Model {}

cityModel.init(
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
    },
    estate_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "favourites",
    underscored: true, 
    freezeTableName: true, 
    createdAt: true, 
    updatedAt: true, 
  }
);
