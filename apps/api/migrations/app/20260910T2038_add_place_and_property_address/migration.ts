#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/329f229a8b4fdcc726dcd3a5f1a11fab974a93398193adb8941d08130bf7802e/contract';
import endContract from '../../snapshots/329f229a8b4fdcc726dcd3a5f1a11fab974a93398193adb8941d08130bf7802e/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'country',
        columns: [
          col('code', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'place',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('latitude', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
          col('longitude', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('parentPlaceId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('stateId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('type', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'place_type_check_1231c8cf',
            "\"type\" IN ('DISTRICT', 'SUBDISTRICT', 'AREA')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'property',
        columns: [
          col('address', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('countryId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('houseNumber', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('landmark', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('latitude', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
          col('longitude', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
          col('name', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('placeId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('propertyType', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('stateId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('street', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('unitIdentifier', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'property_propertyType_check_f6c633bf',
            "\"propertyType\" IN ('ESTATE', 'COMPOUND', 'BUILDING', 'HOUSE', 'APARTMENT', 'HOSTEL', 'SHOP', 'OFFICE', 'WAREHOUSE', 'LAND')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'propertyRelationship',
        columns: [
          col('childPropertyId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('parentPropertyId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('relationshipType', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'propertyRelationship_relationshipType_check_e9ec8862',
            '"relationshipType" IN (\'CONTAINS\')',
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'state',
        columns: [
          col('code', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('countryId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'country',
        constraint: 'country_code_key',
        columns: ['code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'propertyRelationship',
        constraint: 'propertyRelationship_childPropertyId_key',
        columns: ['childPropertyId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'state',
        constraint: 'state_countryId_code_key',
        columns: ['countryId', 'code'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'place',
        index: 'place_parentPlaceId_idx_c3920ca3',
        columns: ['parentPlaceId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'place',
        index: 'place_stateId_idx_ca668a8f',
        columns: ['stateId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'property',
        index: 'property_countryId_idx_27b43b27',
        columns: ['countryId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'property',
        index: 'property_placeId_idx_918e92e1',
        columns: ['placeId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'property',
        index: 'property_stateId_idx_ca668a8f',
        columns: ['stateId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'propertyRelationship',
        index: 'propertyRelationship_parentPropertyId_idx_76fd56d7',
        columns: ['parentPropertyId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'state',
        index: 'state_countryId_idx_27b43b27',
        columns: ['countryId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'place',
        foreignKey: {
          name: 'place_stateId_fkey',
          columns: ['stateId'],
          references: { schema: 'public', table: 'state', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'place',
        foreignKey: {
          name: 'place_parentPlaceId_fkey',
          columns: ['parentPlaceId'],
          references: { schema: 'public', table: 'place', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'property',
        foreignKey: {
          name: 'property_countryId_fkey',
          columns: ['countryId'],
          references: { schema: 'public', table: 'country', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'property',
        foreignKey: {
          name: 'property_stateId_fkey',
          columns: ['stateId'],
          references: { schema: 'public', table: 'state', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'property',
        foreignKey: {
          name: 'property_placeId_fkey',
          columns: ['placeId'],
          references: { schema: 'public', table: 'place', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'propertyRelationship',
        foreignKey: {
          name: 'propertyRelationship_parentPropertyId_fkey',
          columns: ['parentPropertyId'],
          references: { schema: 'public', table: 'property', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'propertyRelationship',
        foreignKey: {
          name: 'propertyRelationship_childPropertyId_fkey',
          columns: ['childPropertyId'],
          references: { schema: 'public', table: 'property', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'state',
        foreignKey: {
          name: 'state_countryId_fkey',
          columns: ['countryId'],
          references: { schema: 'public', table: 'country', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
