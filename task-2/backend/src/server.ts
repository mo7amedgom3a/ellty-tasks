import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { prisma, disconnectPrisma } from './data/prisma';

const PORT = process.env.PORT || 3000;

/**
 * Start the server
 */
const startServer = async (): Promise<void> => {
  try {
    // Test database connection
    console.log('🔍 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Start server
    app.listen(PORT, () => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 API URL: http://localhost:${PORT}/api`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n📚 Available endpoints:');
      console.log(`   Health Check: http://localhost:${PORT}/api/health`);
      console.log(`   Auth:         http://localhost:${PORT}/api/auth`);
      console.log(`   Users:        http://localhost:${PORT}/api/users`);
      console.log(`   Calculations: http://localhost:${PORT}/api/calculations`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle SIGTERM
process.on('SIGTERM', async () => {
  console.log('👋 SIGTERM received, shutting down gracefully...');
  await disconnectPrisma();
  process.exit(0);
});

// Start the server
startServer();
