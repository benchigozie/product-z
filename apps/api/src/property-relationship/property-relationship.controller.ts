import {
    Body,
    Controller,
    Get,
    Post,
  } from '@nestjs/common';
  
  import { CreatePropertyRelationshipDto } from './dto/create-property-relationship.dto.js';
  import { PropertyRelationshipService } from './property-relationship.service.js';
  
  @Controller('property-relationships')
  export class PropertyRelationshipController {
    constructor(
      private readonly propertyRelationshipService: PropertyRelationshipService,

    ) {}
  
    @Get()
    async findAll() {
      return this.propertyRelationshipService.findAll();
    }
  
    @Post()
    async create(@Body() body: CreatePropertyRelationshipDto) {
      return this.propertyRelationshipService.create(body);
    }
  }