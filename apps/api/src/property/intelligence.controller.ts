import { Controller, Get, Param } from '@nestjs/common';

import { PropertyIntelligenceService } from './intelligence.service.js';

@Controller('properties')
export class PropertyIntelligenceController {
    constructor(
        private readonly intelligenceService: PropertyIntelligenceService,
    ) {}

    @Get(':id/intelligence')
    async findIntelligence(@Param('id') id: string) {
        return this.intelligenceService.findByPropertyId(id);
    }
}