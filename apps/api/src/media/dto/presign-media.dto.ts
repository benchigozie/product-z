import { IsIn, IsInt, IsString, Max, Min } from 'class-validator';

export class PresignMediaDto {
  @IsString()
  @IsIn(['image/jpeg', 'image/png', 'image/webp'])
  contentType!: string;

  @IsInt()
  @Min(1)
  @Max(10 * 1024 * 1024)
  sizeBytes!: number;

  @IsString()
  @IsIn(['PROPERTY_PHOTO', 'LISTING_PHOTO'])
  purpose!: 'PROPERTY_PHOTO' | 'LISTING_PHOTO';
}