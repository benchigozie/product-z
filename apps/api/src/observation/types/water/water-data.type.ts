import { Availability } from '../common/availability.type.js';
import { Reliability } from '../common/reliability.type.js';
import { WaterSource } from './water-source.type.js';

export type WaterData = {
  source: WaterSource[];
  availability: Availability;
  reliability?: Reliability;
};