export declare const CLOCK = "CLOCK";
export interface Clock {
    now(): Date;
}
export declare class SystemClock implements Clock {
    now(): Date;
}
