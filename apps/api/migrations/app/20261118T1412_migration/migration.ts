#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/0ea419be4ab3cab9a7312d2c240acda3d35235d67e6b66981204609832e192b6/contract';
import startContract from '../../snapshots/0ea419be4ab3cab9a7312d2c240acda3d35235d67e6b66981204609832e192b6/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/c22f487aa4c2717c0af446ebb11846e767e956ae4a02e0c1cea7563f8af20a2f/contract';
import endContract from '../../snapshots/c22f487aa4c2717c0af446ebb11846e767e956ae4a02e0c1cea7563f8af20a2f/contract.json' with { type: 'json' };
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
        table: 'matchSuggestion',
        columns: [
          col('candidateConfirmedAt', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('candidateConfirmedByRole', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('candidateConfirmedByUserId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('candidatePropertyId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('disputeReason', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('disputedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('disputedByRole', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('disputedByUserId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('mergeId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('reasons', 'json', { notNull: true, codecRef: { codecId: 'pg/json@1' } }),
          col('reportId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('score', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
          col('sourceConfirmedAt', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('sourceConfirmedByRole', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('sourceConfirmedByUserId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('sourcePropertyId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('PENDING'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'matchSuggestion_candidateConfirmedByRole_check_5f2bbd35',
            "\"candidateConfirmedByRole\" IN ('CREATOR', 'AGENT', 'LANDLORD', 'TENANT', 'OPS', 'ADMIN')",
          ),
          checkExpression(
            'matchSuggestion_disputedByRole_check_2534f9ff',
            "\"disputedByRole\" IN ('CREATOR', 'AGENT', 'LANDLORD', 'TENANT', 'OPS', 'ADMIN')",
          ),
          checkExpression(
            'matchSuggestion_sourceConfirmedByRole_check_24c86f6e',
            "\"sourceConfirmedByRole\" IN ('CREATOR', 'AGENT', 'LANDLORD', 'TENANT', 'OPS', 'ADMIN')",
          ),
          checkExpression(
            'matchSuggestion_status_check_73c7ad9a',
            "\"status\" IN ('PENDING', 'PARTIALLY_CONFIRMED', 'CONFIRMED', 'DISPUTED', 'EXPIRED')",
          ),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'matchSuggestion',
        constraint: 'match_suggestion_pair_unique',
        columns: ['sourcePropertyId', 'candidatePropertyId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'matchSuggestion',
        index: 'matchSuggestion_candidatePropertyId_idx_c4ce9dfd',
        columns: ['candidatePropertyId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'matchSuggestion',
        index: 'matchSuggestion_mergeId_idx_e7839b99',
        columns: ['mergeId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'matchSuggestion',
        index: 'matchSuggestion_reportId_idx_d163019e',
        columns: ['reportId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'matchSuggestion',
        index: 'matchSuggestion_sourcePropertyId_idx_fc483cc6',
        columns: ['sourcePropertyId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'matchSuggestion',
        index: 'matchSuggestion_status_createdAt_idx_58610442',
        columns: ['status', 'createdAt'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'matchSuggestion',
        foreignKey: {
          name: 'matchSuggestion_sourcePropertyId_fkey',
          columns: ['sourcePropertyId'],
          references: { schema: 'public', table: 'property', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'matchSuggestion',
        foreignKey: {
          name: 'matchSuggestion_candidatePropertyId_fkey',
          columns: ['candidatePropertyId'],
          references: { schema: 'public', table: 'property', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'matchSuggestion',
        foreignKey: {
          name: 'matchSuggestion_mergeId_fkey',
          columns: ['mergeId'],
          references: { schema: 'public', table: 'propertyMerge', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'matchSuggestion',
        foreignKey: {
          name: 'matchSuggestion_reportId_fkey',
          columns: ['reportId'],
          references: { schema: 'public', table: 'report', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
