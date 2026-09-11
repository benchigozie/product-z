#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/329f229a8b4fdcc726dcd3a5f1a11fab974a93398193adb8941d08130bf7802e/contract';
import endContract from '../../snapshots/329f229a8b4fdcc726dcd3a5f1a11fab974a93398193adb8941d08130bf7802e/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/b0854eed46485075d8b9797eec1b314dedbe8d59cdd3e17b26f55ecb6c3d346f/contract';
import startContract from '../../snapshots/b0854eed46485075d8b9797eec1b314dedbe8d59cdd3e17b26f55ecb6c3d346f/contract.json' with { type: 'json' };
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
      this.dropColumn({ schema: 'public', table: 'property', column: 'area' }),
      this.dropColumn({ schema: 'public', table: 'property', column: 'city' }),
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
      this.addColumn({
        schema: 'public',
        table: 'property',
        column: col('houseNumber', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'property',
        column: col('placeId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'property',
        column: col('street', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'property',
        column: col('unitIdentifier', 'text', { codecRef: { codecId: 'pg/text@1' } }),
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
        index: 'property_placeId_idx_918e92e1',
        columns: ['placeId'],
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
          name: 'property_placeId_fkey',
          columns: ['placeId'],
          references: { schema: 'public', table: 'place', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
