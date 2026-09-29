#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/91703ed3f920752fa5459e88401b5ff0d515a2fef3aed64dffd52e7e6aa35cf2/contract';
import startContract from '../../snapshots/91703ed3f920752fa5459e88401b5ff0d515a2fef3aed64dffd52e7e6aa35cf2/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/9b464fb2b853158a6c56fd7ad1abee9b6a81b9b55db708147028e618544b895f/contract';
import endContract from '../../snapshots/9b464fb2b853158a6c56fd7ad1abee9b6a81b9b55db708147028e618544b895f/contract.json' with { type: 'json' };
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
        table: 'userPropertyRelationship',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('endedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('endedAtPrecision', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('propertyId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('relationshipType', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('startedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('startedAtPrecision', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'userPropertyRelationship_endedAtPrecision_check_50e083ac',
            "\"endedAtPrecision\" IN ('DAY', 'MONTH', 'YEAR', 'INFERRED')",
          ),
          checkExpression(
            'userPropertyRelationship_relationshipType_check_f0306419',
            "\"relationshipType\" IN ('TENANT', 'RESIDENT', 'AGENT', 'LANDLORD', 'VISITOR', 'NEIGHBOR', 'RANDO')",
          ),
          checkExpression(
            'userPropertyRelationship_startedAtPrecision_check_5ada6fd0',
            "\"startedAtPrecision\" IN ('DAY', 'MONTH', 'YEAR', 'INFERRED')",
          ),
        ],
      }),
      this.createIndex({
        schema: 'public',
        table: 'userPropertyRelationship',
        index: 'upr_property_type_idx_517f7bc3',
        columns: ['propertyId', 'relationshipType'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'userPropertyRelationship',
        index: 'userPropertyRelationship_propertyId_idx_4bcae41c',
        columns: ['propertyId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'userPropertyRelationship',
        index: 'userPropertyRelationship_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'userPropertyRelationship',
        foreignKey: {
          name: 'userPropertyRelationship_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'userPropertyRelationship',
        foreignKey: {
          name: 'userPropertyRelationship_propertyId_fkey',
          columns: ['propertyId'],
          references: { schema: 'public', table: 'property', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
