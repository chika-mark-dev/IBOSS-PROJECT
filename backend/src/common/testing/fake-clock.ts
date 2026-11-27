import { CommonService } from '../common.service';

export class FakeClock extends CommonService {
  constructor(private current: Date) {
    super();
  }

  now(): Date {
    return new Date(this.current.getTime());
  }

  set(date: Date): void {
    this.current = date;
  }

  advanceSeconds(seconds: number): void {
    this.current = new Date(this.current.getTime() + seconds * 1000);
  }
}
