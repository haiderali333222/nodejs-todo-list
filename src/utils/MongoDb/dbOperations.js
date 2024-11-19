import connectDatabase from 'connection/MongoDB'; // Import the connection file
import logger from 'utils/logger';

class MongoOperations {
  constructor() {
    this.db = null;
    this.client = null;
  }

  // Initialize the database connection
  async init() {
    if (!this.db || !this.client) {
      const { db, client } = await connectDatabase();
      this.db = db;
      this.client = client;
    }
  }

  // Get the collection dynamically
  getCollection(collectionName) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db.collection(collectionName);
  }

  // Insert one document
  async insertOne(collectionName, document) {
    await this.init();
    const collection = this.getCollection(collectionName);
    try {
      const result = await collection.insertOne(document);
      logger.info(`[insertOne] Inserted document into ${collectionName}`);
      return result;
    } catch (error) {
      logger.error('[insertOne] Error inserting document', error);
      throw error;
    }
  }

  // Insert many documents
  async insertMany(collectionName, documents) {
    await this.init();
    const collection = this.getCollection(collectionName);
    try {
      const result = await collection.insertMany(documents);
      logger.info(`[insertMany] Inserted ${documents.length} documents into ${collectionName}`);
      return result;
    } catch (error) {
      logger.error('[insertMany] Error inserting documents', error);
      throw error;
    }
  }

  // Get one document
  async getOne(collectionName, query) {
    await this.init();
    const collection = this.getCollection(collectionName);
    try {
      const result = await collection.findOne(query);
      return result;
    } catch (error) {
      logger.error('[getOne] Error fetching document', error);
      throw error;
    }
  }
  async count(collectionName, query) {
    await this.init();
    const collection = this.getCollection(collectionName);
    try {
      const result = await collection.countDocuments(query);
      return result;
    } catch (error) {
      logger.error('[count] Error fetching document', error);
      throw error;
    }
  }
  async aggregate(collectionName, query) {
    await this.init();
    const collection = this.getCollection(collectionName);
    try {
      const result = await collection.aggregate(query).toArray();
      return result;
    } catch (error) {
      logger.error('[count] Error fetching document', error);
      throw error;
    }
  }

  // Get many documents
  async getMany(collectionName, query, options = {}) {
    await this.init();
    const collection = this.getCollection(collectionName);
    try {
      const result = await collection.find(query, options).toArray();
      return result;
    } catch (error) {
      logger.error('[getMany] Error fetching documents', error);
      throw error;
    }
  }

  // Update one document
  async updateOne(collectionName, query, updateData) {
    await this.init();
    const collection = this.getCollection(collectionName);
    try {
      const result = await collection.updateOne(query, { $set: updateData });
      logger.info(`[updateOne] Updated document in ${collectionName}`);
      return result;
    } catch (error) {
      logger.error('[updateOne] Error updating document', error);
      throw error;
    }
  }

  // Update many documents
  async updateMany(collectionName, query, updateData) {
    await this.init();
    const collection = this.getCollection(collectionName);
    try {
      const result = await collection.updateMany(query, { $set: updateData });
      logger.info(`[updateMany] Updated documents in ${collectionName}`);
      return result;
    } catch (error) {
      logger.error('[updateMany] Error updating documents', error);
      throw error;
    }
  }

  // Delete one document
  async deleteOne(collectionName, query) {
    await this.init();
    const collection = this.getCollection(collectionName);
    try {
      const result = await collection.deleteOne(query);
      logger.info(`[deleteOne] Deleted document from ${collectionName}`);
      return result;
    } catch (error) {
      logger.error('[deleteOne] Error deleting document', error);
      throw error;
    }
  }

  // Delete many documents
  async deleteMany(collectionName, query) {
    await this.init();
    const collection = this.getCollection(collectionName);
    try {
      const result = await collection.deleteMany(query);
      logger.info(`[deleteMany] Deleted documents from ${collectionName}`);
      return result;
    } catch (error) {
      logger.error('[deleteMany] Error deleting documents', error);
      throw error;
    }
  }

  // Close the connection
  async close() {
    try {
      await this.client.close();
      logger.info('MongoDB connection closed');
    } catch (error) {
      logger.error('[close] Error closing MongoDB connection', error);
      throw error;
    }
  }
}

export default MongoOperations;
