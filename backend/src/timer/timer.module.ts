import { Module } from '@nestjs/common';
import { TimerService } from './timer.service';
import { TimerController } from './timer.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  providers: [TimerService],
  controllers: [TimerController],
  exports: [TimerService],
})
export class TimerModule {}
