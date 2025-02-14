// Importerer nødvendige moduler
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import sequelize from '../config/sequelizeConfig.js';

/**
* Læser data fra en CSV-fil og returnerer det som en array af objekter.
* @param {string} fileName - Navnet på CSV-filen.
* @returns {Promise} - En promise, der returnerer den parsede CSV-data.
*/
const getCsvData = async (fileName) => {
  const csvPath = path.resolve(`./data/${fileName}`);
  const data = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => data.push(row))
      .on('end', () => resolve(data))
      .on('error', (error) => reject(error));
  });
};

/**
* Indsætter data fra en CSV-fil i databasen.
* @param {string} fileName - Navnet på CSV-filen, der skal importeres.
* @param {Object} model - Sequelize-modellen, der skal indsættes i.
*/
const seedFromCsv = async (fileName, model) => {
  const transaction = await sequelize.transaction();

  try {
    const data = await getCsvData(fileName);
    await model.bulkCreate(data, { transaction });

    await transaction.commit();
    console.log(`Seeding completed for ${fileName}`);
  } catch (error) {
    await transaction.rollback();
    console.error('Seeding error:', error);
  }
};

export { getCsvData, seedFromCsv };