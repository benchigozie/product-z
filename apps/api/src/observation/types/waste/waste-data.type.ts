import { WasteCollection } from './waste-collection.type.js';
import { WasteCondition } from './waste-condition.type.js';

export type WasteData = {
  condition?: WasteCondition;
  collection?: WasteCollection;
};