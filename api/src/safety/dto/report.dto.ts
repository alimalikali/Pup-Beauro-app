import { IsIn, IsString, IsUUID, Length } from "class-validator";
export class ReportUserDto {
  @IsUUID() reportedUserId: string;
  @IsIn([
    "fake_profile",
    "harassment",
    "inappropriate_content",
    "spam",
    "other",
  ])
  category: string;
  @IsString() @Length(10, 1000) details: string;
}
