// Importing necessary modules
import { createConnection } from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from '../schema';
import { DatabaseConfig } from 'src/infrastructure/config/DatabaseConfig';
import { seedUser } from './scripts/seedUser';
import { seedImages } from './scripts/seedImages';
import { seedAlbums } from './scripts/seedAlbums';
import { seedImagesAlbums } from './scripts/seedImagesAlbums';

const getDatabaseConnection = async () => {
  try {
    const connection = await createConnection({
      host: DatabaseConfig.DATABASE_HOST,
      user: DatabaseConfig.DATABASE_USER,
      database: DatabaseConfig.DATABASE_NAME,
      password: DatabaseConfig.DATABASE_PASSWORD,
      port: DatabaseConfig.DATABASE_PORT,
      charset: 'utf8mb4',
    });
    console.log('Connection to the database has been established successfully.');
    return drizzle(connection, { schema, mode: 'default' });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
};

// Main function to setup and seed the database
async function main() {
  try {
    const db = await getDatabaseConnection();
    await seedUser(db);
    await seedImages(db);
    await seedAlbums(db);
    await seedImagesAlbums(db);
  } catch (error) {
    console.error('Failed to setup database:', error);
    process.exit(1);
  }
}

main();
