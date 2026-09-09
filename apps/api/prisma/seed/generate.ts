import { readFile, writeFile } from 'node:fs/promises';

type SourceState = {
  name: string;
  state_code: string | null;
};

type SourceCountry = {
  name: string;
  iso2: string;
  states: SourceState[];
};

type SourceResponse = {
  error: boolean;
  msg: string;
  data: SourceCountry[];
};

const SOURCE = 'prisma/seed/source/countries-states.json';
const COUNTRIES_OUTPUT = 'prisma/seed/countries.ts';
const STATES_OUTPUT = 'prisma/seed/states.ts';

const raw = await readFile(SOURCE, 'utf8');
const source: SourceResponse = JSON.parse(raw);

if (source.error) {
  throw new Error(`Source API returned an error: ${source.msg}`);
}

const countries = source.data
  .map((country) => ({
    name: country.name,
    code: country.iso2,
  }))
  .sort((a, b) => a.code.localeCompare(b.code));

const states: {
  name: string;
  code: string;
  countryCode: string;
}[] = [];

const skippedStates: {
  country: string;
  countryCode: string;
  state: string;
}[] = [];

for (const country of source.data) {
  for (const state of country.states) {
    if (!state.state_code) {
      skippedStates.push({
        country: country.name,
        countryCode: country.iso2,
        state: state.name,
      });

      continue;
    }

    states.push({
      name: state.name,
      code: state.state_code,
      countryCode: country.iso2,
    });
  }
}

states.sort(
  (a, b) =>
    a.countryCode.localeCompare(b.countryCode) ||
    a.code.localeCompare(b.code),
);

const countriesFile = `export const countries = ${JSON.stringify(
  countries,
  null,
  2,
)} as const;\n`;

const statesFile = `export const states = ${JSON.stringify(
  states,
  null,
  2,
)} as const;\n`;

await writeFile(COUNTRIES_OUTPUT, countriesFile);
await writeFile(STATES_OUTPUT, statesFile);

console.log(`Generated ${countries.length} countries`);
console.log(`Generated ${states.length} states/subdivisions`);

if (skippedStates.length > 0) {
  console.log('\nSkipped subdivisions with missing codes:');

  for (const state of skippedStates) {
    console.log(
      `- ${state.country} (${state.countryCode}): ${state.state}`,
    );
  }
}