import { Availability } from '../common/availability.type.js';
import { Reliability } from '../common/reliability.type.js';
import { Coverage } from './coverage.type.js';
import { InternetConnectionType } from './internet-connection-type.type.js';

export type InternetData = {
  provider: string;
  connectionType: InternetConnectionType;
  availability: Availability;
  reliability?: Reliability;
  coverage?: Coverage;
};