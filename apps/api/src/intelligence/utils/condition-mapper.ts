import { ConclusionState } from '../enums/conclusion-state.enum.js';
import { PowerCondition } from '../enums/power-condition.enum.js';
import { WaterCondition } from '../enums/water-condition.enum.js';
import { FloodingCondition } from '../enums/flooding-condition.enum.js';
import { SecurityCondition } from '../enums/security-condition.enum.js';
import { InternetCondition } from '../enums/internet-condition.enum.js';
import { SanitationConclusion } from '../enums/sanitation-conclusion.enum.js';
import { RoadAccessConclusion } from '../enums/road-access-conclusion.enum.js';
import { BuildingConditionConclusion } from '../enums/building-condition-conclusion.enum.js';

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


export function securityToConclusionState(
    condition: SecurityCondition,
): ConclusionState {
    switch (condition) {
        case SecurityCondition.SECURE:
            return ConclusionState.ABSENT;
        case SecurityCondition.CAUTIOUS:
            return ConclusionState.MIXED;
        case SecurityCondition.INSECURE:
            return ConclusionState.PRESENT;
        case SecurityCondition.UNRESOLVED:
            return ConclusionState.UNRESOLVED;
    }
}


export function internetToConclusionState(
    condition: InternetCondition,
): ConclusionState {
    switch (condition) {
        case InternetCondition.AVAILABLE:
            return ConclusionState.PRESENT;
        case InternetCondition.INTERMITTENT:
            return ConclusionState.MIXED;
        case InternetCondition.UNAVAILABLE:
            return ConclusionState.ABSENT;
        case InternetCondition.UNRESOLVED:
            return ConclusionState.UNRESOLVED;
    }
}


export function sanitationToConclusionState(
    conclusion: SanitationConclusion,
): ConclusionState {
    switch (conclusion) {
        case SanitationConclusion.SANITARY:
            return ConclusionState.ABSENT;
        case SanitationConclusion.CONCERNING:
            return ConclusionState.MIXED;
        case SanitationConclusion.UNSANITARY:
            return ConclusionState.PRESENT;
        case SanitationConclusion.UNRESOLVED:
            return ConclusionState.UNRESOLVED;
    }
}



export function roadAccessToConclusionState(
    conclusion: RoadAccessConclusion,
): ConclusionState {
    switch (conclusion) {
        case RoadAccessConclusion.WELL_ACCESSIBLE:
            return ConclusionState.ABSENT;
        case RoadAccessConclusion.ACCESSIBLE_BUT_POOR:
            return ConclusionState.MIXED;
        case RoadAccessConclusion.LIMITED_ACCESS:
            return ConclusionState.PRESENT;
        case RoadAccessConclusion.UNRESOLVED:
            return ConclusionState.UNRESOLVED;
    }
}



export function buildingConditionToConclusionState(
    conclusion: BuildingConditionConclusion,
): ConclusionState {
    switch (conclusion) {
        case BuildingConditionConclusion.SOUND:
            return ConclusionState.ABSENT;
        case BuildingConditionConclusion.CONCERNING:
            return ConclusionState.MIXED;
        case BuildingConditionConclusion.UNSAFE:
            return ConclusionState.PRESENT;
        case BuildingConditionConclusion.UNRESOLVED:
            return ConclusionState.UNRESOLVED;
    }
}