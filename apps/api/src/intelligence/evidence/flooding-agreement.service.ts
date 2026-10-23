import { Injectable } from '@nestjs/common';

import { FloodingOccurrence } from '../../observation/types/flooding/flooding-occurrence.type.js';
import { FloodingExtent } from '../../observation/types/flooding/flooding-extent.type.js';
import { Severity } from '../../observation/types/common/severity.type.js';
import type { FloodingData } from '../../observation/types/flooding/flooding-data.type.js';
import type { FloodingAgreementResult } from './types/flooding-agreement.type.js';

@Injectable()
export class FloodingAgreementService {
    compare(
        first: FloodingData,
        second: FloodingData,
    ): FloodingAgreementResult {
        const occurrenceDifference = Math.abs(
            this.occurrenceValue(first.occurrence) -
            this.occurrenceValue(second.occurrence),
        );

        const severityDifference =
            first.severity !== undefined && second.severity !== undefined
                ? Math.abs(
                    this.severityValue(first.severity) -
                    this.severityValue(second.severity),
                )
                : null;

        const extentDifference = Math.abs(
            this.extentValue(first.extent) -
            this.extentValue(second.extent),
        );

        return {
            occurrenceDifference,
            severityDifference,
            extentDifference,
        };
    }

    private occurrenceValue(occurrence: FloodingOccurrence): number {
        switch (occurrence) {
            case FloodingOccurrence.NO_FLOODING_OBSERVED:
                return 0;
            case FloodingOccurrence.EVIDENCE_OF_PAST_FLOODING:
                return 1;
            case FloodingOccurrence.FLOODING_OBSERVED:
                return 2;
        }
    }

    private severityValue(severity: Severity): number {
        switch (severity) {
            case Severity.MINOR:
                return 0;
            case Severity.MODERATE:
                return 1;
            case Severity.SEVERE:
                return 2;
        }
    }

    private extentValue(extent: FloodingExtent): number {
        switch (extent) {
            case FloodingExtent.WIDER_AREA:
                return 0;
            case FloodingExtent.STREET:
                return 1;
            case FloodingExtent.IMMEDIATE_ACCESS:
                return 2;
            case FloodingExtent.PROPERTY:
                return 3;
        }
    }
}