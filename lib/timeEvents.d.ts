interface TimeEventObject {
    fromTimestamp: number;
    repeatInterval?: number;
    repeatEvery?: {
        daysOfWeek?: number[];
        daysOfMonth?: number[];
    };
}
export declare class TimeEvents {
    readonly ONE_DAY: number;
    readonly ONE_WEEK: number;
    private tEData;
    constructor();
    private _next;
    addTimeEvent(tEObj: TimeEventObject): void;
    nextAfter(next: number, startTimestamp: number): number[];
    next(next?: number): number[];
}
export {};
