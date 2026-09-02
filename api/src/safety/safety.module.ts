import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Favorite } from "./entities/favorite.entity";
import { Block } from "./entities/block.entity";
import { Report } from "./entities/report.entity";
import { Notification } from "./entities/notification.entity";
import { SafetyService } from "./safety.service";
import { SafetyController } from "./safety.controller";
import { UsersModule } from "../users/users.module";
@Module({
  imports: [
    TypeOrmModule.forFeature([Favorite, Block, Report, Notification]),
    UsersModule,
  ],
  providers: [SafetyService],
  controllers: [SafetyController],
  exports: [SafetyService],
})
export class SafetyModule {}
