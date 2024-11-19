import db from 'connection/MongoDB';
import { dbKeys } from './dbKeys';
async function createCollection() {
  try {
    const collectionList = _.keys(dbKeys);
    // Create the collection with the schema validation
    for (let i = 0; i < collectionList.length; i++) {
      await db.createCollection(collectionList[i], {
        validator: dbKeys[collectionList[i]],
        validationLevel: 'strict', // Enforce strict schema validation
        validationAction: 'error', // Reject invalid documents
      });

      logger.info(
        `[SUCCESS] Collection "${COLLECTION_NAME}" created successfully with schema.`
      );
    }
  } catch (error) {
    logger.error(`[ERROR] Failed to create collection`, error.message);
  }
}

createCollection();
