import {
  IsString,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
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
}
