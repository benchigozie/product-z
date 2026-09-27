#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/61329c0950098f4edab297484fef4bd68f5a813b85b3e30799fa17133d197bac/contract';
import startContract from '../../snapshots/61329c0950098f4edab297484fef4bd68f5a813b85b3e30799fa17133d197bac/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/91703ed3f920752fa5459e88401b5ff0d515a2fef3aed64dffd52e7e6aa35cf2/contract';
import endContract from '../../snapshots/91703ed3f920752fa5459e88401b5ff0d515a2fef3aed64dffd52e7e6aa35cf2/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'observation',
        column: col('userId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.createIndex({
        schema: 'public',
        table: 'observation',
        index: 'observation_userId_idx_a489d58a',
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
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
