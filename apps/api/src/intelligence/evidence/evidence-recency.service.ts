import { Injectable } from '@nestjs/common';
import { Temporal } from '@js-temporal/polyfill';

import type { ObservationResult } from '../../observation/types/observation-result.type.js';
import { EVIDENCE_RECENCY_RULES } from './evidence-recency.rules.js';
import { EvidenceRecencyClassification } from './evidence-recency.classification.js';

@Injectable()
export class EvidenceRecencyService {
  classify(
    observation: NonNullable<ObservationResult>,
  ): EvidenceRecencyClassification {
    const rule = EVIDENCE_RECENCY_RULES[observation.category];

    const ageInDays =
      (Temporal.Now.instant().epochMilliseconds -
        observation.observedAt.epochMilliseconds) /
      (1000 * 60 * 60 * 24);

    if (ageInDays <= rule.recentDays) {
      return EvidenceRecencyClassification.RECENT;
    }

    if (ageInDays > rule.oldDays) {
      return EvidenceRecencyClassification.OLD;
    }

    return EvidenceRecencyClassification.NEITHER;
  }
}