import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
  now(): Date {
    return new Date();
  }
}
