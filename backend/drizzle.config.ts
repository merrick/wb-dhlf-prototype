/**
 * Drizzle Kit Configuration
 * Version: 1.0.0
 */

import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: './data/dhlf.db',
  },
} satisfies Config;