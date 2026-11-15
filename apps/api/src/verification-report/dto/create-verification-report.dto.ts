import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVerificationReportDto {
    @IsString()
    @IsNotEmpty()
    propertyId!: string;
}