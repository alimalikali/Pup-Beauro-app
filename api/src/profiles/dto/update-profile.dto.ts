import { Type } from "class-transformer";
import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  displayName?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(18)
  @Max(65)
  age?: number;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  sect?: string;

  @IsOptional()
  @IsString()
  education?: string;

  @IsOptional()
  @IsString()
  profession?: string;

  @IsOptional()
  @IsString()
  familyType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  bio?: string;

  @IsOptional()
  @IsString()
  waliEmail?: string;

  @IsOptional()
  @IsObject()
  partnerPreferences?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  valuesAndBeliefs?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  lifestylePreferences?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  longTermGoals?: Record<string, unknown>;
}

export class UpdatePurposeDto {
  @IsString()
  @MinLength(40)
  @MaxLength(4000)
  purposeStatement: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  lifeTags?: string[];
}

export class UpdatePrioritiesDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  priorityDeen?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  priorityEducation?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  priorityCareer?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  priorityFamily?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  priorityLocation?: number;
}
