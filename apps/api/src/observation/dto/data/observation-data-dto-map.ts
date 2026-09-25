import type { ClassConstructor } from 'class-transformer';

import { ObservationCategory } from '../../enums/observation-category.enum.js';

import { BuildingConditionDataDto } from './building-condition-data.dto.js';
import { ConstructionDataDto } from './construction-data.dto.js';
import { DrainageDataDto } from './drainage-data.dto.js';
import { FloodingDataDto } from './flooding-data.dto.js';
import { InternetDataDto } from './internet-data.dto.js';
import { OtherDataDto } from './other-data.dto.js';
import { ParkingDataDto } from './parking-data.dto.js';
import { PowerDataDto } from './power-data.dto.js';
import { RoadAccessDataDto } from './road-access-data.dto.js';
import { SanitationDataDto } from './sanitation-data.dto.js';
import { SecurityDataDto } from './security-data.dto.js';
import { WaterDataDto } from './water-data.dto.js';
import { WasteDataDto } from './waste-data.dto.js';

export const observationDataDtoMap: Partial<
  Record<ObservationCategory, ClassConstructor<object>>
> = {
  [ObservationCategory.POWER]: PowerDataDto,
  [ObservationCategory.WATER]: WaterDataDto,
  [ObservationCategory.INTERNET]: InternetDataDto,
  [ObservationCategory.FLOODING]: FloodingDataDto,
  [ObservationCategory.ROAD_ACCESS]: RoadAccessDataDto,
  [ObservationCategory.DRAINAGE]: DrainageDataDto,
  [ObservationCategory.SECURITY]: SecurityDataDto,
  [ObservationCategory.WASTE]: WasteDataDto,
  [ObservationCategory.BUILDING_CONDITION]: BuildingConditionDataDto,
  [ObservationCategory.PARKING]: ParkingDataDto,
  [ObservationCategory.SANITATION]: SanitationDataDto,
  [ObservationCategory.CONSTRUCTION]: ConstructionDataDto,
  [ObservationCategory.OTHER]: OtherDataDto,
};