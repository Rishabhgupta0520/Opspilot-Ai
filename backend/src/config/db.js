import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    try {
      console.log(`Connecting to external MongoDB at ${uri.replace(/:([^:@]{4})[^:@]*@/, ':****@')}...`);
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 4000
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`External MongoDB connection failed (${err.message}). Falling back to MongoMemoryServer...`);
    }
  }

  try {
    console.log('Initializing embedded MongoDB instance (MongoMemoryServer)...');
    mongoMemoryServer = await MongoMemoryServer.create();
    const memoryUri = mongoMemoryServer.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`Embedded MongoDB Connected: ${conn.connection.host} (${memoryUri})`);
    return conn;
  } catch (error) {
    console.error('Failed to initialize MongoDB connection:', error.message);
    throw error;
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
    console.log('MongoDB disconnected cleanly');
  } catch (err) {
    console.error('Error disconnecting MongoDB:', err.message);
  }
};
