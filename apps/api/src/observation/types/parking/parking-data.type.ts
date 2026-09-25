import { ParkingAvailability } from './parking-availability.type.js';

export type ParkingData = {
  availability: ParkingAvailability;
  description?: string;
};