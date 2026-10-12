#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/a950594179a6c5d779d8464a3d85c501948427ce5e2320a08df798d4cc58df2e/contract';
import endContract from '../../snapshots/a950594179a6c5d779d8464a3d85c501948427ce5e2320a08df798d4cc58df2e/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/b80fcbb926045993cae80d87e2e605e96dfc22a6dcb0de441324abebe49bf379/contract';
import startContract from '../../snapshots/b80fcbb926045993cae80d87e2e605e96dfc22a6dcb0de441324abebe49bf379/contract.json' with { type: 'json' };
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
      this.dropCheckConstraint({
        schema: 'public',
        table: 'property',
        constraint: 'property_propertyType_check_f6c633bf',
      }),
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
      this.addColumn({
        schema: 'public',
        table: 'observation',
        column: col('userId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'property',
        constraint: 'property_propertyType_check_3d6185d3',
        expression:
          "\"propertyType\" IN ('ESTATE', 'COMPOUND', 'BUILDING', 'HOUSE', 'APARTMENT', 'HOSTEL', 'UNIT', 'SHOP', 'OFFICE', 'WAREHOUSE', 'LAND')",
      }),
      this.createIndex({
        schema: 'public',
        table: 'observation',
        index: 'observation_userId_idx_a489d58a',
        columns: ['userId'],
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
        table: 'observation',
        foreignKey: {
          name: 'observation_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
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
