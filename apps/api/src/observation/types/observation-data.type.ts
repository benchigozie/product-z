import type { BuildingConditionData } from './building-condition/building-condition-data.type.js';
import type { ConstructionData } from './construction/construction-data.type.js';
import type { DrainageData } from './drainage/drainage-data.type.js';
import type { FloodingData } from './flooding/flooding-data.type.js';
import type { InternetData } from './internet/internet-data.type.js';
import type { ParkingData } from './parking/parking-data.type.js';
import type { PowerData } from './power/power-data.type.js';
import type { RoadAccessData } from './road/road-access-data.type.js';
import type { SanitationData } from './sanitation/sanitation-data.type.js';
import type { SecurityData } from './security/security-data.type.js';
import type { WaterData } from './water/water-data.type.js';
import type { WasteData } from './waste/waste-data.type.js';
import type { OtherData } from './other/other-data.type.js';

export type ObservationData =
  | PowerData
  | WaterData
  | InternetData
  | FloodingData
  | RoadAccessData
  | DrainageData
  | SecurityData
  | WasteData
  | BuildingConditionData
  | ParkingData
  | SanitationData
  | ConstructionData
  | OtherData;