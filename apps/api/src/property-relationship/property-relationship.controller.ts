import {
  Body,
  Controller,
  Get,
  Post,
  Param,
} from '@nestjs/common';

import { CreatePropertyRelationshipDto } from './dto/create-property-relationship.dto.js';
import { PropertyRelationshipService } from './property-relationship.service.js';
import type {
  PropertyRelationshipListResult,
  PropertyRelationshipResult,
} from './types/property-relationship-result.type.js';

@Controller('property-relationships')
export class PropertyRelationshipController {
  constructor(
    private readonly propertyRelationshipService: PropertyRelationshipService,

  ) { }

  @Get()
  async findAll() {
    return this.propertyRelationshipService.findAll();
  }

  @Post()
  async create(@Body() body: CreatePropertyRelationshipDto) {
    return this.propertyRelationshipService.create(body);
  }

  @Get('parent/:propertyId')
  async findParent(
    @Param('propertyId') propertyId: string,
  ): Promise<PropertyRelationshipResult> {
    return this.propertyRelationshipService.findParentWithProperty(propertyId);
  }

  @Get('children/:propertyId')
  async findChildren(
    @Param('propertyId') propertyId: string,
  ): Promise<PropertyRelationshipListResult> {
    return this.propertyRelationshipService.findChildrenWithProperties(propertyId);
  }

}