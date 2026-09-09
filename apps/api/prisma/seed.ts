import dotenv from 'dotenv';
import { countries } from './seed/countries.js';
import { states } from './seed/states.js';

const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.development';

dotenv.config({ path: envFile });

const { db } = await import('../src/prisma/db.js');

console.log('Product Z seed started');
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Loaded: ${envFile}`);

await db.connect({
  url: process.env['DATABASE_URL']!,
});

console.log('Database connected');

const nigeria = countries.find(
  (country) => country.code === 'NG',
);

if (!nigeria) {
  throw new Error('Nigeria not found in seed data');
}

const country = await db.orm.public.Country.upsert({
  create: {
    name: nigeria.name,
    code: nigeria.code,
  },
  update: {
    name: nigeria.name,
  },
  conflictOn: {
    code: nigeria.code,
  },
});

console.log('UPSERTED COUNTRY:', country);

const lagos = states.find(
  (state) =>
    state.countryCode === 'NG' &&
    state.code === 'NG-LA',
);

if (!lagos) {
  throw new Error('Lagos not found in seed data');
}

const state = await db.orm.public.State.upsert({
  create: {
    name: lagos.name,
    code: lagos.code,
    countryId: country.id,
  },
  update: {
    name: lagos.name,
  },
  conflictOn: {
    countryId: country.id,
    code: lagos.code,
  },
});

console.log('UPSERTED STATE:', state);

await db.close();

console.log('Product Z seed finished');