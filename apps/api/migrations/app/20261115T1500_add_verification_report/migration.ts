#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/a76c41fc876d9b1b3291785843dc394fbdef02bc96fb00d582a1be3277442101/contract';
import startContract from '../../snapshots/a76c41fc876d9b1b3291785843dc394fbdef02bc96fb00d582a1be3277442101/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/c18a6f7f80b1aac1db14c59114cda801b698abef04546a2bd7c9bcc8e77b01c0/contract';
import endContract from '../../snapshots/c18a6f7f80b1aac1db14c59114cda801b698abef04546a2bd7c9bcc8e77b01c0/contract.json' with { type: 'json' };
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
        table: 'verificationReport',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('latitude', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
          col('longitude', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
          col('propertyId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('publishedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('recordingDurationSeconds', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('recordingEndedAt', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('recordingStartedAt', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('recordingUrl', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('requestedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('reviewNotes', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('reviewedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('reviewerId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('scope', 'text', {
            notNull: true,
            default: lit('PROPERTY'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('status', 'text', {
            notNull: true,
            default: lit('REQUESTED'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('verifierId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('verificationReport_scope_check_2b7175c2', '"scope" IN (\'PROPERTY\')'),
          checkExpression(
            'verificationReport_status_check_4aeff44d',
            "\"status\" IN ('REQUESTED', 'IN_PROGRESS', 'PENDING_REVIEW', 'PUBLISHED', 'REJECTED', 'CANCELLED')",
          ),
        ],
      }),
      this.createIndex({
        schema: 'public',
        table: 'verificationReport',
        index: 'verificationReport_propertyId_idx_4bcae41c',
        columns: ['propertyId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'verificationReport',
        index: 'verificationReport_reviewerId_idx_25a27b4e',
        columns: ['reviewerId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'verificationReport',
        index: 'verificationReport_status_idx_e98638ab',
        columns: ['status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'verificationReport',
        index: 'verificationReport_verifierId_idx_0abe2287',
        columns: ['verifierId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'verificationReport',
        foreignKey: {
          name: 'verificationReport_propertyId_fkey',
          columns: ['propertyId'],
          references: { schema: 'public', table: 'property', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'verificationReport',
        foreignKey: {
          name: 'verificationReport_verifierId_fkey',
          columns: ['verifierId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'verificationReport',
        foreignKey: {
          name: 'verificationReport_reviewerId_fkey',
          columns: ['reviewerId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
