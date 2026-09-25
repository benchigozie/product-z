import { Severity } from '../common/severity.type.js';
import { FloodingOccurrence } from './flooding-occurence.type.js';
import { FloodingExtent } from './floodind-extent.type.js';

export type FloodingData = {
  occurrence: FloodingOccurrence;
  extent: FloodingExtent;
  severity?: Severity;
  conditions?: string;
};