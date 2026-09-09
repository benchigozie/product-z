import { Body, Controller, Get, Post } from '@nestjs/common';
import { PropertyService } from './property.service.js';
import { CreatePropertyDto } from './dto/create-property.dto.js';

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
}