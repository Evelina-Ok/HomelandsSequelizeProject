import { Model, DataTypes } from "sequelize";
import bcrypt from 'bcrypt'
export class staffModel extends Model {}

staffModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  }, {
    sequelize,
    modelName: "staffs", 
    underscored: true, 
    hooks: {
        beforeCreate: async (staffModel, options) => {
            staffModel.password = await createHash(staffModel.password)
        },
        beforeUpdate: async (staffModel, options) => {
            staffModel.password = await createHash(staffModel.password)
        }
    }
  });

  //not necessary to use addHook
/*   staffModel.addHook('beforeBulkCreate', async staffs => {
    for(const user of staffs) {
        user.password = await bcrypt.hash(user.password, 10)
    }
  }) */

    // encrypts the passwords and sends to database:
const createHash = async string => {
    const salt = await bcrypt.genSalt(10)
    const hashed_string = await bcrypt.hash(string, salt)
    return hashed_string
}
