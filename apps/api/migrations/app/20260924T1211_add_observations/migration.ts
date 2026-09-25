#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/6a90d81028ab87d13d704e4c3d013ca35a1e7ebfd9ac2f9bc91e21c6fa0a2bf2/contract';
import startContract from '../../snapshots/6a90d81028ab87d13d704e4c3d013ca35a1e7ebfd9ac2f9bc91e21c6fa0a2bf2/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/b80fcbb926045993cae80d87e2e605e96dfc22a6dcb0de441324abebe49bf379/contract';
import endContract from '../../snapshots/b80fcbb926045993cae80d87e2e605e96dfc22a6dcb0de441324abebe49bf379/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'observation',
        columns: [
          col('category', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('data', 'json', { codecRef: { codecId: 'pg/json@1' } }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('observedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('placeId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('propertyId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'observation_category_check_560a7350',
            "\"category\" IN ('POWER', 'WATER', 'INTERNET', 'FLOODING', 'ROAD_ACCESS', 'DRAINAGE', 'SECURITY', 'WASTE', 'NOISE', 'BUILDING_CONDITION', 'PARKING', 'SANITATION', 'LIGHTING', 'ENVIRONMENT', 'CONSTRUCTION', 'OTHER')",
          ),
        ],
      }),
      this.createIndex({
        schema: 'public',
        table: 'observation',
        index: 'observation_placeId_idx_918e92e1',
        columns: ['placeId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'observation',
        index: 'observation_propertyId_idx_4bcae41c',
        columns: ['propertyId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'observation',
        foreignKey: {
          name: 'observation_propertyId_fkey',
          columns: ['propertyId'],
          references: { schema: 'public', table: 'property', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'observation',
        foreignKey: {
          name: 'observation_placeId_fkey',
          columns: ['placeId'],
          references: { schema: 'public', table: 'place', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
