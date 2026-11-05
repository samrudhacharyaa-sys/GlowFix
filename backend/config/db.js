const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/glowfix';

  try {
    // Attempt connecting to the configured MongoDB (local or Atlas)
    console.log(`[Database] Attempting connection to MongoDB at: ${primaryUri}`);
    await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] Successfully connected to MongoDB: ${mongoose.connection.host}`);
  } catch (err) {
    console.warn(`[Database] Could not connect to primary MongoDB (${err.message}).`);
    console.log('[Database] Initializing MongoDB In-Memory Server for evaluation & fallback...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'glowfix'
        }
      });
      const memoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`[Database] Connected to In-Memory MongoDB: ${memoryUri}`);
      console.log('[Database] System is fully operational with in-memory persistence.');
    } catch (memErr) {
      console.error('[Database] Fatal: Failed to initialize in-memory MongoDB fallback:', memErr.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
