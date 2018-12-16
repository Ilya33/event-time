interface EventTimeObject {
    fromTimestamp: number;
    repeatInterval?: number;
    repeatEvery?: {
        daysOfWeek?: number[];
    };
}
export declare class EventTime {
    readonly ONE_DAY: number;
    readonly ONE_WEEK: number;
    private eTData;
    constructor();
    private _next;
    addEventTime(eTObj: EventTimeObject): void;
    nextAfter(next: number, startTimestamp: number): number[];
    next(next?: number): number[];
}
export {};
