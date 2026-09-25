import { Availability } from "../common/availability.type";
import { Reliability } from "../common/reliability.type";

export enum PowerSource {
  GRID = 'GRID',
  GENERATOR = 'GENERATOR',
  SOLAR = 'SOLAR',
  INVERTER = 'INVERTER',
  BATTERY = 'BATTERY',
  OTHER = 'OTHER',
}

export type PowerData = {
  source: PowerSource[];
  availability: Availability;
  reliability?: Reliability;
};