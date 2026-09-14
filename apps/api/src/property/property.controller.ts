import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PropertyService } from './property.service.js';
import { CreatePropertyDto } from './dto/create-property.dto.js';
import type { PropertyListResult, PropertyResult } from './types/property-result.type.js';

@Controller('properties')
export class PropertyController {
    constructor(
        private readonly propertyService: PropertyService,
    ) { }

    @Get()
    async findAll() {
        return this.propertyService.findAll();
    }

    @Post()
    async create(@Body() body: CreatePropertyDto) {
        return this.propertyService.create(body);
    }

    @Get('place/:placeId')
    async findByPlaceId(@Param('placeId') placeId: string) : Promise<PropertyListResult> {
        return this.propertyService.findByPlaceId(placeId);
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<PropertyResult> {
        return this.propertyService.findById(id);
    }
}

