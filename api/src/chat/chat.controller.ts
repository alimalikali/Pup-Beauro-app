import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ChatService } from './chat.service';

@Controller('chat')
@UseGuards(JwtGuard)
export class ChatController {
  constructor(private chat: ChatService) {}

  @Get('conversations')
  getConversations(@CurrentUser() user: User) {
    return this.chat.getConversations(user.id);
  }

  @Get('conversations/:id')
  getMessages(@Param('id') id: string, @CurrentUser() user: User) {
    return this.chat.getMessages(id, user.id);
  }

  @Post('conversations/:id/wali')
  setWali(@Param('id') id: string, @Body() body: { waliEmail: string }) {
    return this.chat.setWali(id, body.waliEmail);
  }
}
