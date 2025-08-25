import {
  IsString,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
  IsArray,
  IsDateString,
} from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  @MaxLength(50)
  slug!: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  waitlistTitle?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  waitlistDescription?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  waitlistBackground?: string;

  // Separated image fields
  @IsString()
  @IsOptional()
  @MaxLength(200)
  iconImage?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  detailImages?: string[];

  @IsString()
  @IsOptional()
  @MaxLength(50)
  category?: string;

  // New fields for service detail page
  @IsString()
  @IsOptional()
  @MaxLength(200)
  tagline?: string;

  @IsString()
  @IsOptional()
  @MaxLength(5000)
  fullDescription?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  developer?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  language?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  platform?: string;

  @IsDateString()
  @IsOptional()
  launchDate?: string;
}
