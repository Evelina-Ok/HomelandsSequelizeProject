// Import af dependencies
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Giver adgang til variabler fra en .env-fil via process.env
dotenv.config();

if (
  !process.env.DBNAME ||
  !process.env.DBUSER ||
  !process.env.DBPASSWD ||
  !process.env.DBHOST
) {
  console.error(
    "Error: Can not connect to database because of missing credentials"
  );
  process.exit(1);
}

const sequelize = new Sequelize(
  // Databasens navn
  process.env.DBNAME,
  // Brugernavn til databasen
  process.env.DBUSER,
  // Adgangskode til databasen
  process.env.DBPASSWD,
  {
    // Database-serverens adresse
    host: process.env.DBHOST,
    // Porten databasen kører på
    port: process.env.DBPORT, 
    // or port: process.env.DBPORT || 3306, if we have local port
    // Databasetype (MySQL)
    dialect: "mysql",
  }
);

sequelize.authenticate()
.then(() => console.log('Connection to database is established'))
.catch(error => console.log(`Could not connet to database: ${error}`))


export default sequelize;

