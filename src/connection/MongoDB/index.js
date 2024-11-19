import { MongoClient } from 'mongodb';
import logger from 'utils/logger';
import { MONGODB_URL, MONGO_USER, MONGO_PW, MONGODB_NAME } from 'config/mongo';
import { ENVIRONMENT } from 'config';


async function connectDatabase() {
  console.log(ENVIRONMENT)
  const dbURL =
    ENVIRONMENT === 'local'
      ? `mongodb://${MONGODB_URL}`
      : `mongodb://${MONGO_USER}:${MONGO_PW}@${MONGODB_URL}`;

  logger.info('[connectDatabase] Connecting Mongo Server', dbURL);

  try {
    const client = new MongoClient(dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Connect to the MongoDB cluster
    await client.connect();

    logger.info('[connectDatabase] Successfully connected to MongoDB');

    const db = client.db(MONGODB_NAME);

    // Set up error and close event handlers
    client.on('close', () => logger.info('MongoDB connection closed.'));
    client.on('error', (error) => {
      logger.error('[connectDatabase] MongoDB connection error', { error });
      throw error;
    });

    // Return the database and the client
    return { db, client };
  } catch (error) {
    const errorMessage = `[connectDatabase] Exception: ${
      error?.message || 'Unable to connect Mongo Server'
    }`;
    logger.error(errorMessage, { error });
    throw error;
  }
}

export default connectDatabase;
