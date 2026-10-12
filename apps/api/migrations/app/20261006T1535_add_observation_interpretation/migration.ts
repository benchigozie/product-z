#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/c2a0c932f354defa549150e1aa89e19fac17503cc533e998ae2011ec36bf54fd/contract';
import startContract from '../../snapshots/c2a0c932f354defa549150e1aa89e19fac17503cc533e998ae2011ec36bf54fd/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/d90a9becc1580767e1ee3bdbd76f7e05c3fa885909051e8f6d0a5cf92d1ed97c/contract';
import endContract from '../../snapshots/d90a9becc1580767e1ee3bdbd76f7e05c3fa885909051e8f6d0a5cf92d1ed97c/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'observation',
        column: col('interpretation', 'json', { codecRef: { codecId: 'pg/json@1' } }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
