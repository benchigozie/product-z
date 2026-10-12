#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/a950594179a6c5d779d8464a3d85c501948427ce5e2320a08df798d4cc58df2e/contract';
import startContract from '../../snapshots/a950594179a6c5d779d8464a3d85c501948427ce5e2320a08df798d4cc58df2e/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/c2a0c932f354defa549150e1aa89e19fac17503cc533e998ae2011ec36bf54fd/contract';
import endContract from '../../snapshots/c2a0c932f354defa549150e1aa89e19fac17503cc533e998ae2011ec36bf54fd/contract.json' with { type: 'json' };
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
        table: 'intelligence',
        columns: [
          col('categories', 'json', { notNull: true, codecRef: { codecId: 'pg/json@1' } }),
          col('computedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('considerations', 'json', { notNull: true, codecRef: { codecId: 'pg/json@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('evidenceThrough', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('failureReason', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('overall', 'json', { notNull: true, codecRef: { codecId: 'pg/json@1' } }),
          col('placeId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('propertyId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'intelligence_status_check_38a5fb20',
            "\"status\" IN ('PENDING', 'PROCESSING', 'CURRENT', 'FAILED')",
          ),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'intelligence',
        constraint: 'intelligence_propertyId_key',
        columns: ['propertyId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'intelligence',
        constraint: 'intelligence_placeId_key',
        columns: ['placeId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'intelligence',
        index: 'intelligence_placeId_idx_918e92e1',
        columns: ['placeId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'intelligence',
        index: 'intelligence_propertyId_idx_4bcae41c',
        columns: ['propertyId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'intelligence',
        index: 'intelligence_status_idx_e98638ab',
        columns: ['status'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'intelligence',
        foreignKey: {
          name: 'intelligence_propertyId_fkey',
          columns: ['propertyId'],
          references: { schema: 'public', table: 'property', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'intelligence',
        foreignKey: {
          name: 'intelligence_placeId_fkey',
          columns: ['placeId'],
          references: { schema: 'public', table: 'place', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
