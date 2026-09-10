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

try {
  for (const country of countries) {
    await db.orm.public.Country.upsert({
      create: {
        name: country.name,
        code: country.code,
      },
      update: {
        name: country.name,
      },
      conflictOn: {
        code: country.code,
      },
    });
  }

  console.log(`Seeded ${countries.length} countries`);

  const countryRows = await db.orm.public.Country.all();

  const countryIds = new Map(
    countryRows.map((country) => [country.code, country.id]),
  );

  for (const state of states) {
    const countryId = countryIds.get(state.countryCode);

    if (!countryId) {
      throw new Error(
        `Country not found for state: ${state.name} (${state.countryCode})`,
      );
    }

    await db.orm.public.State.upsert({
      create: {
        name: state.name,
        code: state.code,
        countryId,
      },
      update: {
        name: state.name,
      },
      conflictOn: {
        countryId,
        code: state.code,
      },
    });
  }

  console.log(`Seeded ${states.length} states/subdivisions`);

  const seededCountries = await db.orm.public.Country.all();
  const seededStates = await db.orm.public.State.all();

  if (seededCountries.length !== countries.length) {
    throw new Error(
      `Expected ${countries.length} countries, found ${seededCountries.length}`,
    );
  }

  if (seededStates.length !== states.length) {
    throw new Error(
      `Expected ${states.length} states/subdivisions, found ${seededStates.length}`,
    );
  }

  console.log('Seed verification passed');
  console.log('Product Z seed finished');
} finally {
  await db.close();
}