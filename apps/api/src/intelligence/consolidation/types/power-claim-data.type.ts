import type { PowerSource } from '../../../observation/types/power/power-data.type.js';
import type { Availability } from '../../../observation/types/common/availability.type.js';

export interface PowerClaimData {
    source: PowerSource[];
    availability: Availability;
}