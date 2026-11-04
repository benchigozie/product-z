import type { InternetConnectionType } from '../../../observation/types/internet/internet-connection-type.type.js';
import type { Availability } from '../../../observation/types/common/availability.type.js';

export interface InternetClaimData {
    connectionType: InternetConnectionType;
    availability: Availability;
}