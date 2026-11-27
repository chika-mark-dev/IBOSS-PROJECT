import { CommonService } from '../common.service';
export declare class FakeClock extends CommonService {
    private current;
    constructor(current: Date);
    now(): Date;
    set(date: Date): void;
    advanceSeconds(seconds: number): void;
}
