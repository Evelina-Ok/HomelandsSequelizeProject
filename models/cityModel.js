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
    zipcode: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "cities", // Modellens navn
    underscored: true, // True: city_brands || False: cityBrands
    freezeTableName: true, // True: city || False: city
    createdAt: true, // Tilføjer createdAt felt
    updatedAt: true, // Tilføjer updatedAt felt
  }
);
