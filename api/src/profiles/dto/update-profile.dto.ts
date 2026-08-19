import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional() @IsString()
  displayName?: string;

  @IsOptional() @IsNumber() @Min(18) @Max(65)
  age?: number;

  @IsOptional() @IsString()
  city?: string;

  @IsOptional() @IsString()
  sect?: string;

  @IsOptional() @IsString()
  education?: string;

  @IsOptional() @IsString()
  profession?: string;

  @IsOptional() @IsString()
  familyType?: string;

  @IsOptional() @IsString()
  bio?: string;

  @IsOptional() @IsString()
  waliEmail?: string;
}

export class UpdatePurposeDto {
  @IsString()
  purposeStatement: string;

  @IsOptional()
  lifeTags?: string[];
}

export class UpdatePrioritiesDto {
  @IsOptional() @IsNumber() @Min(0) @Max(100)
  priorityDeen?: number;

  @IsOptional() @IsNumber() @Min(0) @Max(100)
  priorityEducation?: number;

  @IsOptional() @IsNumber() @Min(0) @Max(100)
  priorityCareer?: number;

  @IsOptional() @IsNumber() @Min(0) @Max(100)
  priorityFamily?: number;

  @IsOptional() @IsNumber() @Min(0) @Max(100)
  priorityLocation?: number;
}
