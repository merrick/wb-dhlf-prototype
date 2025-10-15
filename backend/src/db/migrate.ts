/**
 * Database Migration Script
 * Version: 1.0.0
 * 
 * Creates database tables and imports CSV data
 */

import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db, sqlite } from './connection';

async function runMigrations() {
  console.log('🚀 Starting database migrations...');
  
  try {
    // Run Drizzle migrations
    migrate(db, { migrationsFolder: './drizzle' });
    console.log('✅ Database schema created successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('🎉 Migrations completed successfully');
      sqlite.close();
    })
    .catch((error) => {
      console.error('❌ Migration process failed:', error);
      sqlite.close();
      process.exit(1);
    });
}

export { runMigrations };