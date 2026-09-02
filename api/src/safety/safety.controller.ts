import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ParseUUIDPipe,
} from "@nestjs/common";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User } from "../users/entities/user.entity";
import { SafetyService } from "./safety.service";
import { ReportUserDto } from "./dto/report.dto";
@Controller()
@UseGuards(JwtGuard)
export class SafetyController {
  constructor(private safety: SafetyService) {}
  @Get("favorites") favorites(@CurrentUser() u: User) {
    return this.safety.listFavorites(u.id);
  }
  @Post("favorites/:id") favorite(
    @CurrentUser() u: User,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.safety.favorite(u.id, id);
  }
  @Delete("favorites/:id") unfavorite(
    @CurrentUser() u: User,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.safety.unfavorite(u.id, id);
  }
  @Get("blocks") blocks(@CurrentUser() u: User) {
    return this.safety.listBlocks(u.id);
  }
  @Post("blocks/:id") block(
    @CurrentUser() u: User,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.safety.block(u.id, id);
  }
  @Delete("blocks/:id") unblock(
    @CurrentUser() u: User,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.safety.unblock(u.id, id);
  }
  @Post("reports") report(@CurrentUser() u: User, @Body() dto: ReportUserDto) {
    return this.safety.report(u.id, dto);
  }
  @Get("notifications") notifications(@CurrentUser() u: User) {
    return this.safety.listNotifications(u.id);
  }
  @Put("notifications/:id/read") read(
    @CurrentUser() u: User,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.safety.readNotification(u.id, id);
  }
}
