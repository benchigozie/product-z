import { Module } from '@nestjs/common';

import { IntelligenceService } from './intelligence.service.js';
import { ObservationInterpretationService } from './interpretation/observation-interpretation.service.js';
import { EvidenceAnalysisService } from './evidence/evidence-analysis.service.js';
import { EvidenceRecencyService } from './evidence/evidence-recency.service.js';
import { PowerAgreementService } from './power-agreement.service.js';
import { ObservationDataModule } from '../observation/data/observation-data.module.js';
import { PowerAgreementClassifier } from './power-agreement-classifier.js';

@Module({
    imports: [
        ObservationDataModule,
    ],

    providers: [
        IntelligenceService,
        ObservationInterpretationService,
        EvidenceAnalysisService,
        EvidenceRecencyService,
        PowerAgreementService,
        PowerAgreementClassifier,
    ],

    exports: [
        IntelligenceService,
        ObservationInterpretationService,
        EvidenceAnalysisService,
    ],
})
export class IntelligenceModule {}