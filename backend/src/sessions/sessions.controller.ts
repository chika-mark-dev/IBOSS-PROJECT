import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SaveAnswerDto } from './dto/save-answer.dto';
import { SessionsService } from './sessions.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ROLE } from 'src/users/entities/user.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLE.student)
@Controller()
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post('exams/:id/sessions')
  start(
    @Param('id', ParseUUIDPipe) examId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.sessionsService.start(userId, examId);
  }

  @Get('sessions/:id')
  getOne(
    @Param('id', ParseUUIDPipe) sessionId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.sessionsService.getForUser(sessionId, userId);
  }

  @Put('sessions/:id/answers/:questionId')
  saveAnswer(
    @Param('id', ParseUUIDPipe) sessionId: string,
    @Param('questionId', ParseUUIDPipe) questionId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: SaveAnswerDto,
  ) {
    return this.sessionsService.saveAnswer(sessionId, userId, questionId, dto);
  }

  @Post('sessions/:id/submit')
  @HttpCode(HttpStatus.OK)
  submit(
    @Param('id', ParseUUIDPipe) sessionId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.sessionsService.submit(sessionId, userId);
  }

  @Get('sessions/:id/result')
  result(
    @Param('id', ParseUUIDPipe) sessionId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.sessionsService.getResult(sessionId, userId);
  }
}
