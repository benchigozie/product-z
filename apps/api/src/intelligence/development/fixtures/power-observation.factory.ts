
import type {
    ObservationResult,
} from '../../../observation/types/observation-result.type.js';

import {
    Availability,
} from '../../../observation/types/common/availability.type.js';

import {
    Reliability,
} from '../../../observation/types/common/reliability.type.js';

import {
    PowerSource,
} from '../../../observation/types/power/power-data.type.js';

export interface PowerObservationOverrides {
    id?: string;
    observedAt?: Date;
    availability?: Availability;
    reliability?: Reliability | undefined;
    source?: PowerSource[];
    description?: string | null;
    interpretation?: unknown;
}

type PowerObservation = NonNullable<ObservationResult>;

const DEFAULT_TIMESTAMP = new Date('2026-10-10T12:00:00.000Z');

export function createPowerObservation(
    overrides: PowerObservationOverrides = {},
): PowerObservation {
    const {
        id = 'cmockpower00000000000001',
        observedAt = DEFAULT_TIMESTAMP,
        availability = Availability.AVAILABLE,
        source = [PowerSource.GRID],
        description = 'Power supply observation fixture.',
        interpretation = null,
    } = overrides;

    const data = {
        source,
        availability,
        ...(overrides.reliability !== undefined
            ? { reliability: overrides.reliability }
            : {}),
    };

    return {
        id,
        category: 'POWER',
        propertyId: 'cmockproperty000000000001',
        placeId: null,
        data,
        description,
        observedAt,
        userId: null,
        createdAt: DEFAULT_TIMESTAMP,
        updatedAt: DEFAULT_TIMESTAMP,
        interpretation,
    } as PowerObservation;
}
