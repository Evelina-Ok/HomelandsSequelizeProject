import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";
import bcrypt from 'bcrypt'
export class userModel extends Model {}

userModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refresh_token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
  }, {
    sequelize,
    modelName: "user", 
    underscored: true, 
    hooks: {
        beforeCreate: async (userModel, options) => {
            userModel.password = await createHash(userModel.password)
        },
        beforeUpdate: async (userModel, options) => {
            userModel.password = await createHash(userModel.password)
        }
    }
  });

  //not necessary to use addHook
/*   userModel.addHook('beforeBulkCreate', async users => {
    for(const user of users) {
        user.password = await bcrypt.hash(user.password, 10)
    }
  }) */

    // encrypts the passwords and sends to database:
const createHash = async string => {
    const salt = await bcrypt.genSalt(10)
    const hashed_string = await bcrypt.hash(string, salt)
    return hashed_string
}
