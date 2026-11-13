import { Injectable, Logger } from '@nestjs/common';

import { ObservationCategory } from '../../observation/enums/observation-category.enum.js';
import { Availability } from '../../observation/types/common/availability.type.js';
import { Reliability } from '../../observation/types/common/reliability.type.js';
import { Coverage } from '../../observation/types/internet/coverage.type.js';
import { InternetConnectionType } from '../../observation/types/internet/internet-connection-type.type.js';
import { Severity } from '../../observation/types/common/severity.type.js';
import { FloodingOccurrence } from '../../observation/types/flooding/flooding-occurrence.type.js';
import { FloodingExtent } from '../../observation/types/flooding/flooding-extent.type.js';
import { SecurityAccessControl } from '../../observation/types/security/security-access-control.type.js';
import { SecurityPersonnel } from '../../observation/types/security/security-personnel.type.js';
import { SecurityFeature } from '../../observation/types/security/security-feature.type.js';
import { SanitationCondition } from '../../observation/types/sanitation/sanitation-condition.type.js';
import { RoadCondition } from '../../observation/types/road/road-condition.type.js';
import { RoadAccessibility } from '../../observation/types/road/road-accessibility.type.js';
import { BuildingCondition } from '../../observation/types/building-condition/building-condition.type.js';
import { BuildingComponent } from '../../observation/types/building-condition/building-component.type.js';
import { BuildingIssue } from '../../observation/types/building-condition/building-issue.type.js';

import type {
    ObservationIngestionResult,
    ParsedObservation,
} from './types/observation-ingestion.types.js';

interface CategoryValidator {
    validate(data: unknown): string | null;
}

@Injectable()
export class ObservationIngestionValidationService {
    private readonly logger = new Logger(
        ObservationIngestionValidationService.name,
    );

    validateAndNormalize(value: unknown): ObservationIngestionResult {
        if (
            typeof value !== 'object' ||
            value === null ||
            Array.isArray(value)
        ) {
            this.logger.warn(
                'Ingestion response is not a plain object; returning empty.',
            );
            return { observations: [], rejected: [] };
        }

        const record = value as Record<string, unknown>;

        if (!Array.isArray(record.observations)) {
            this.logger.warn(
                'Ingestion response has no observations array; returning empty.',
            );
            return { observations: [], rejected: [] };
        }

        const valid: ParsedObservation[] = [];
        const rejected: ObservationIngestionResult['rejected'] = [];

        for (const raw of record.observations) {
            if (
                typeof raw !== 'object' ||
                raw === null ||
                Array.isArray(raw)
            ) {
                rejected.push({
                    category: ObservationCategory.OTHER,
                    reason: 'not an object',
                    raw,
                });
                continue;
            }

            const obs = raw as Record<string, unknown>;
            const category = obs.category as ObservationCategory | undefined;

            if (
                !category ||
                !Object.values(ObservationCategory).includes(category)
            ) {
                rejected.push({
                    category: ObservationCategory.OTHER,
                    reason: `invalid category: ${String(obs.category)}`,
                    raw,
                });
                continue;
            }

            if (
                typeof obs.description !== 'string' ||
                obs.description.trim().length === 0
            ) {
                rejected.push({
                    category,
                    reason: 'missing or empty description',
                    raw,
                });
                continue;
            }

            const validator = this.validatorFor(category);

            if (!validator) {
                rejected.push({
                    category,
                    reason: `no validator for category ${category}`,
                    raw,
                });
                continue;
            }

            const reason = validator.validate(obs.data);

            if (reason !== null) {
                rejected.push({ category, reason, raw });
                continue;
            }

            valid.push({
                category,
                data: obs.data as Record<string, unknown>,
                description: obs.description.trim(),
            });
        }

        return { observations: valid, rejected };
    }

    private validatorFor(
        category: ObservationCategory,
    ): CategoryValidator | null {
        switch (category) {
            case ObservationCategory.POWER:
            case ObservationCategory.WATER:
                return { validate: (d) => this.validatePowerOrWater(d) };
            case ObservationCategory.INTERNET:
                return { validate: (d) => this.validateInternet(d) };
            case ObservationCategory.FLOODING:
                return { validate: (d) => this.validateFlooding(d) };
            case ObservationCategory.SECURITY:
                return { validate: (d) => this.validateSecurity(d) };
            case ObservationCategory.SANITATION:
                return { validate: (d) => this.validateSanitation(d) };
            case ObservationCategory.ROAD_ACCESS:
                return { validate: (d) => this.validateRoadAccess(d) };
            case ObservationCategory.BUILDING_CONDITION:
                return { validate: (d) => this.validateBuildingCondition(d) };
            default:
                return null;
        }
    }

    private validatePowerOrWater(data: unknown): string | null {
        if (typeof data !== 'object' || data === null || Array.isArray(data)) {
            return 'data is not an object';
        }
        const d = data as Record<string, unknown>;
        if (!Array.isArray(d.source) || d.source.length === 0) {
            return 'missing or empty source array';
        }
        if (!Object.values(Availability).includes(d.availability as Availability)) {
            return `invalid availability: ${String(d.availability)}`;
        }
        if (
            d.reliability !== undefined &&
            !Object.values(Reliability).includes(d.reliability as Reliability)
        ) {
            return `invalid reliability: ${String(d.reliability)}`;
        }
        return null;
    }

    private validateInternet(data: unknown): string | null {
        if (typeof data !== 'object' || data === null || Array.isArray(data)) {
            return 'data is not an object';
        }
        const d = data as Record<string, unknown>;
        if (typeof d.provider !== 'string' || d.provider.trim().length === 0) {
            return 'missing provider';
        }
        if (
            !Object.values(InternetConnectionType).includes(
                d.connectionType as InternetConnectionType,
            )
        ) {
            return `invalid connectionType: ${String(d.connectionType)}`;
        }
        if (!Object.values(Availability).includes(d.availability as Availability)) {
            return `invalid availability: ${String(d.availability)}`;
        }
        if (
            d.reliability !== undefined &&
            !Object.values(Reliability).includes(d.reliability as Reliability)
        ) {
            return `invalid reliability: ${String(d.reliability)}`;
        }
        if (
            d.coverage !== undefined &&
            !Object.values(Coverage).includes(d.coverage as Coverage)
        ) {
            return `invalid coverage: ${String(d.coverage)}`;
        }
        return null;
    }

    private validateFlooding(data: unknown): string | null {
        if (typeof data !== 'object' || data === null || Array.isArray(data)) {
            return 'data is not an object';
        }
        const d = data as Record<string, unknown>;
        if (
            !Object.values(FloodingOccurrence).includes(
                d.occurrence as FloodingOccurrence,
            )
        ) {
            return `invalid occurrence: ${String(d.occurrence)}`;
        }
        if (!Object.values(FloodingExtent).includes(d.extent as FloodingExtent)) {
            return `invalid extent: ${String(d.extent)}`;
        }
        if (
            d.severity !== undefined &&
            !Object.values(Severity).includes(d.severity as Severity)
        ) {
            return `invalid severity: ${String(d.severity)}`;
        }
        return null;
    }

    private validateSecurity(data: unknown): string | null {
        if (typeof data !== 'object' || data === null || Array.isArray(data)) {
            return 'data is not an object';
        }
        const d = data as Record<string, unknown>;
        if (
            d.accessControl === undefined &&
            d.personnel === undefined &&
            (!Array.isArray(d.features) || d.features.length === 0)
        ) {
            return 'security observation requires accessControl, personnel, or features';
        }
        if (
            d.accessControl !== undefined &&
            !Object.values(SecurityAccessControl).includes(
                d.accessControl as SecurityAccessControl,
            )
        ) {
            return `invalid accessControl: ${String(d.accessControl)}`;
        }
        if (
            d.personnel !== undefined &&
            !Object.values(SecurityPersonnel).includes(
                d.personnel as SecurityPersonnel,
            )
        ) {
            return `invalid personnel: ${String(d.personnel)}`;
        }
        if (d.features !== undefined) {
            if (!Array.isArray(d.features)) {
                return 'features is not an array';
            }
            for (const f of d.features) {
                if (!Object.values(SecurityFeature).includes(f as SecurityFeature)) {
                    return `invalid feature: ${String(f)}`;
                }
            }
        }
        return null;
    }

    private validateSanitation(data: unknown): string | null {
        if (typeof data !== 'object' || data === null || Array.isArray(data)) {
            return 'data is not an object';
        }
        const d = data as Record<string, unknown>;
        if (
            !Object.values(SanitationCondition).includes(
                d.condition as SanitationCondition,
            )
        ) {
            return `invalid condition: ${String(d.condition)}`;
        }
        return null;
    }

    private validateRoadAccess(data: unknown): string | null {
        if (typeof data !== 'object' || data === null || Array.isArray(data)) {
            return 'data is not an object';
        }
        const d = data as Record<string, unknown>;
        if (!Object.values(RoadCondition).includes(d.condition as RoadCondition)) {
            return `invalid condition: ${String(d.condition)}`;
        }
        if (!Array.isArray(d.accessibility) || d.accessibility.length === 0) {
            return 'missing or empty accessibility array';
        }
        for (const a of d.accessibility) {
            if (
                !Object.values(RoadAccessibility).includes(a as RoadAccessibility)
            ) {
                return `invalid accessibility: ${String(a)}`;
            }
        }
        return null;
    }

    private validateBuildingCondition(data: unknown): string | null {
        if (typeof data !== 'object' || data === null || Array.isArray(data)) {
            return 'data is not an object';
        }
        const d = data as Record<string, unknown>;
        if (
            !Object.values(BuildingCondition).includes(
                d.condition as BuildingCondition,
            )
        ) {
            return `invalid condition: ${String(d.condition)}`;
        }
        if (!Array.isArray(d.issues)) {
            return 'missing issues array';
        }
        for (const entry of d.issues) {
            if (
                typeof entry !== 'object' ||
                entry === null ||
                Array.isArray(entry)
            ) {
                return 'issue entry is not an object';
            }
            const e = entry as Record<string, unknown>;
            if (!Object.values(BuildingIssue).includes(e.issue as BuildingIssue)) {
                return `invalid issue: ${String(e.issue)}`;
            }
            if (
                e.component !== undefined &&
                !Object.values(BuildingComponent).includes(
                    e.component as BuildingComponent,
                )
            ) {
                return `invalid component: ${String(e.component)}`;
            }
        }
        if (!Array.isArray(d.components)) {
            return 'missing components array';
        }
        for (const c of d.components) {
            if (!Object.values(BuildingComponent).includes(c as BuildingComponent)) {
                return `invalid component: ${String(c)}`;
            }
        }
        return null;
    }
}