import {
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateTextObservationDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    propertyId?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    placeId?: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(5000)
    text!: string;
}