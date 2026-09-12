import {
    Body,
    Controller,
    Get,
    Param,
    Post,
  } from '@nestjs/common';
  
  import { CreatePlaceDto } from './dto/create-place.dto.js';
  import type { PlaceResult } from './types/place-result.type.js';
  import { PlaceService } from './place.service.js';
  
  @Controller('places')
  export class PlaceController {
    constructor(
      private readonly placeService: PlaceService,
    ) {}
  
    @Get()
    async findAll() {
      return this.placeService.findAll();
    }
  
    @Post()
    async create(@Body() body: CreatePlaceDto) {
      return this.placeService.create(body);
    }
  
    @Get(':id')
    async findById(@Param('id') id: string): Promise<PlaceResult> {
      return this.placeService.findById(id);
    }
  }