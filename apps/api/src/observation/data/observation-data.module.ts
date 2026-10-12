import { Module } from '@nestjs/common';

import { ObservationRepository } from '../observation.repository.js';

@Module({
    providers: [
        ObservationRepository,
    ],

    exports: [
        ObservationRepository,
    ],
})
export class ObservationDataModule {}