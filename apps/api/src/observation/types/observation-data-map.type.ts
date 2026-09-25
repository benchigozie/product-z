import { ObservationCategory } from '../enums/observation-category.enum.js';

import type { BuildingConditionData } from './building-condition/building-condition-data.type.js';
import type { ConstructionData } from './construction/construction-data.type.js';
import type { DrainageData } from './drainage/drainage-data.type.js';
import type { FloodingData } from './flooding/flooding-data.type.js';
import type { InternetData } from './internet/internet-data.type.js';
import type { OtherData } from './other/other-data.type.js';
import type { ParkingData } from './parking/parking-data.type.js';
import type { PowerData } from './power/power-data.type.js';
import type { RoadAccessData } from './road/road-access-data.type.js';
import type { SanitationData } from './sanitation/sanitation-data.type.js';
import type { SecurityData } from './security/security-data.type.js';
import type { WaterData } from './water/water-data.type.js';
import type { WasteData } from './waste/waste-data.type.js';

export type ObservationDataMap = {
  [ObservationCategory.POWER]: PowerData;
  [ObservationCategory.WATER]: WaterData;
  [ObservationCategory.INTERNET]: InternetData;
  [ObservationCategory.FLOODING]: FloodingData;
  [ObservationCategory.ROAD_ACCESS]: RoadAccessData;
  [ObservationCategory.DRAINAGE]: DrainageData;
  [ObservationCategory.SECURITY]: SecurityData;
  [ObservationCategory.WASTE]: WasteData;
  [ObservationCategory.NOISE]: undefined;
  [ObservationCategory.BUILDING_CONDITION]: BuildingConditionData;
  [ObservationCategory.PARKING]: ParkingData;
  [ObservationCategory.SANITATION]: SanitationData;
  [ObservationCategory.LIGHTING]: undefined;
  [ObservationCategory.ENVIRONMENT]: undefined;
  [ObservationCategory.CONSTRUCTION]: ConstructionData;
  [ObservationCategory.OTHER]: OtherData;
};