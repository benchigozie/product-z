import { ConclusionState } from '../enums/conclusion-state.enum.js';
import { PowerCondition } from '../enums/power-condition.enum.js';
import { WaterCondition } from '../enums/water-condition.enum.js';
import { FloodingCondition } from '../enums/flooding-condition.enum.js';

export function powerToConclusionState(
    condition: PowerCondition,
): ConclusionState {
    switch (condition) {
        case PowerCondition.AVAILABLE: return ConclusionState.PRESENT;
        case PowerCondition.INTERMITTENT: return ConclusionState.MIXED;
        case PowerCondition.UNAVAILABLE: return ConclusionState.ABSENT;
        case PowerCondition.UNRESOLVED: return ConclusionState.UNRESOLVED;
    }
}

export function waterToConclusionState(
    condition: WaterCondition,
): ConclusionState {
    switch (condition) {
        case WaterCondition.AVAILABLE: return ConclusionState.PRESENT;
        case WaterCondition.INTERMITTENT: return ConclusionState.MIXED;
        case WaterCondition.UNAVAILABLE: return ConclusionState.ABSENT;
        case WaterCondition.UNRESOLVED: return ConclusionState.UNRESOLVED;
    }
}

export function floodingToConclusionState(
    condition: FloodingCondition,
): ConclusionState {
    switch (condition) {
        case FloodingCondition.FLOODS: return ConclusionState.PRESENT;
        case FloodingCondition.SIGNS_OF_FLOODING: return ConclusionState.MIXED;
        case FloodingCondition.DOES_NOT_FLOOD: return ConclusionState.ABSENT;
        case FloodingCondition.UNRESOLVED: return ConclusionState.UNRESOLVED;
    }
}