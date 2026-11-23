// vitest.setup.merge.ts
//
// Vitest doesn't go through Nest's bootstrap, so neither `NODE_ENV=development`
// from the start:dev script nor Nest's automatic .env.development loading is
// applied. Load it explicitly here, before any test file imports PrismaService.
import { config } from 'dotenv';
config({ path: '.env.development', override: true });