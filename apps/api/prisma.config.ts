import dotenv from 'dotenv';
import { definePrismaConfig } from '@prisma/cli-engine';
import { defineConfig as ormConfig } from '@prisma/orm-postgres/config';
import postgis from '@prisma/orm-extension-postgis/control';

dotenv.config({
  path: `.env.${process.env.NODE_ENV ?? 'development'}`,
});

const config: ReturnType<typeof definePrismaConfig> = definePrismaConfig({
  orm: ormConfig({
    contract: './src/prisma/contract.prisma',

    extensions: [postgis],

    db: {
      connection: process.env['DATABASE_URL']!,
    },
  }),
});

export default config;