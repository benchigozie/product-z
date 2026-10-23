import { FloodingOccurrence } from './flooding-occurrence.type.js';
import { FloodingExtent } from './flooding-extent.type.js';
import { Severity } from '../common/severity.type.js';

export type FloodingData = {
    occurrence: FloodingOccurrence;
    extent: FloodingExtent;
    severity?: Severity;
    conditions?: string;
};