import type { WaterSource } from '../../../observation/types/water/water-source.type.js';
import type { Availability } from '../../../observation/types/common/availability.type.js';

export interface WaterClaimData {
    source: WaterSource[];
    availability: Availability;
}