import type { ObservationCategory } from "../../observation/enums/observation-category.enum";
import type { EvidenceRecencyRule } from "./types/evidence-recency.type";

export const EVIDENCE_RECENCY_RULES: Record<
    ObservationCategory,
    EvidenceRecencyRule
> = {
    POWER: {
        recentDays: 30,
        oldDays: 180,
    },

    WATER: {
        recentDays: 60,
        oldDays: 180,
    },

    INTERNET: {
        recentDays: 30,
        oldDays: 120,
    },

    FLOODING: {
        recentDays: 90,
        oldDays: 365,
    },

    ROAD_ACCESS: {
        recentDays: 90,
        oldDays: 365,
    },

    DRAINAGE: {
        recentDays: 90,
        oldDays: 365,
    },

    SECURITY: {
        recentDays: 30,
        oldDays: 180,
    },

    WASTE: {
        recentDays: 14,
        oldDays: 90,
    },

    NOISE: {
        recentDays: 30,
        oldDays: 180,
    },

    BUILDING_CONDITION: {
        recentDays: 180,
        oldDays: 365,
    },

    PARKING: {
        recentDays: 90,
        oldDays: 365,
    },

    SANITATION: {
        recentDays: 30,
        oldDays: 180,
    },

    LIGHTING: {
        recentDays: 60,
        oldDays: 180,
    },

    ENVIRONMENT: {
        recentDays: 90,
        oldDays: 365,
    },

    CONSTRUCTION: {
        recentDays: 30,
        oldDays: 180,
    },

    OTHER: {
        recentDays: 60,
        oldDays: 180,
    },
};