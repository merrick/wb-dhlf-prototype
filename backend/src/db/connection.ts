/**
 * Database Connection Configuration
 * Version: 1.0.0
 */

import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import path from 'path';

// Database file path
const dbPath = path.join(process.cwd(), 'data', 'dhlf.db');

// Create better-sqlite3 instance
const sqlite = new Database(dbPath);

// Enable foreign key constraints
sqlite.pragma('foreign_keys = ON');

// Create drizzle database instance
export const db = drizzle(sqlite, { schema });

// Export the sqlite instance for direct queries if needed
export { sqlite };