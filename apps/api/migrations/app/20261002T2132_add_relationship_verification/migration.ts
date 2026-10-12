#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/9b464fb2b853158a6c56fd7ad1abee9b6a81b9b55db708147028e618544b895f/contract';
import startContract from '../../snapshots/9b464fb2b853158a6c56fd7ad1abee9b6a81b9b55db708147028e618544b895f/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/a950594179a6c5d779d8464a3d85c501948427ce5e2320a08df798d4cc58df2e/contract';
import endContract from '../../snapshots/a950594179a6c5d779d8464a3d85c501948427ce5e2320a08df798d4cc58df2e/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'relationshipVerification',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('evidence', 'json', { codecRef: { codecId: 'pg/json@1' } }),
          col('expiresAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('method', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('relationshipId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('reviewerId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('PENDING'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('verifiedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'relationshipVerification_method_check_1b3738cb',
            "\"method\" IN ('PROPERTY_EVIDENCE', 'ADMIN_REVIEW')",
          ),
          checkExpression(
            'relationshipVerification_status_check_3e7b08b2',
            "\"status\" IN ('PENDING', 'VERIFIED', 'REJECTED', 'REVOKED')",
          ),
        ],
      }),
      this.createIndex({
        schema: 'public',
        table: 'relationshipVerification',
        index: 'relationshipVerification_relationshipId_idx_51f7e2f7',
        columns: ['relationshipId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'relationshipVerification',
        index: 'relationshipVerification_status_idx_e98638ab',
        columns: ['status'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'relationshipVerification',
        foreignKey: {
          name: 'relationshipVerification_relationshipId_fkey',
          columns: ['relationshipId'],
          references: { schema: 'public', table: 'userPropertyRelationship', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
