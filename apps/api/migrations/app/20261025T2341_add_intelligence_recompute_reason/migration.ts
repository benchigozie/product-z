#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/a76c41fc876d9b1b3291785843dc394fbdef02bc96fb00d582a1be3277442101/contract';
import endContract from '../../snapshots/a76c41fc876d9b1b3291785843dc394fbdef02bc96fb00d582a1be3277442101/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/d90a9becc1580767e1ee3bdbd76f7e05c3fa885909051e8f6d0a5cf92d1ed97c/contract';
import startContract from '../../snapshots/d90a9becc1580767e1ee3bdbd76f7e05c3fa885909051e8f6d0a5cf92d1ed97c/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'intelligence',
        column: col('lastRecomputeReason', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'intelligence',
        constraint: 'intelligence_lastRecomputeReason_check_5357c67f',
        expression:
          "\"lastRecomputeReason\" IN ('NEW_OBSERVATION', 'PROMPT_CHANGE', 'MANUAL', 'RETRY')",
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
