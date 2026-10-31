import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { IntelligenceAdminService } from './intelligence-admin.service.js';

@Controller('development/admin/intelligence')
export class IntelligenceAdminController {
    constructor(
        private readonly adminService: IntelligenceAdminService,
    ) {}

    @Get('status')
    async status() {
        return this.adminService.getStatus();
    }

    @Post('recompute/:propertyId/:category')
    async recompute(
        @Param('propertyId') propertyId: string,
        @Param('category') category: string,
    ) {
        return this.adminService.recomputeOne(
            propertyId,
            category.toUpperCase(),
        );
    }

    @Post('recompute-by-prompt-version')
    async recomputeByPromptVersion(
        @Body()
        body: {
            category: string;
            fromVersion: string;
        },
    ) {
        return this.adminService.recomputeByPromptVersion(
            body.category.toUpperCase(),
            body.fromVersion,
        );
    }
}