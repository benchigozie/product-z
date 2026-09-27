#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/61329c0950098f4edab297484fef4bd68f5a813b85b3e30799fa17133d197bac/contract';
import endContract from '../../snapshots/61329c0950098f4edab297484fef4bd68f5a813b85b3e30799fa17133d197bac/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/b80fcbb926045993cae80d87e2e605e96dfc22a6dcb0de441324abebe49bf379/contract';
import startContract from '../../snapshots/b80fcbb926045993cae80d87e2e605e96dfc22a6dcb0de441324abebe49bf379/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

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
      this.addCheckConstraint({
        schema: 'public',
        table: 'property',
        constraint: 'property_propertyType_check_3d6185d3',
        expression:
          "\"propertyType\" IN ('ESTATE', 'COMPOUND', 'BUILDING', 'HOUSE', 'APARTMENT', 'HOSTEL', 'UNIT', 'SHOP', 'OFFICE', 'WAREHOUSE', 'LAND')",
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
