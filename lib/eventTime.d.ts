interface EventTimeObject {
    fromTimestamp: number;
    repeatInterval?: number;
    repeatEvery?: {
        daysOfWeek?: number[];
        months?: number;
    };
}
export declare class EventTime {
    readonly ONE_HOUR: number;
    readonly ONE_DAY: number;
    readonly ONE_WEEK: number;
    readonly RF_NONE: number;
    readonly RF_HAS_REPEAT_INTERVAL: number;
    readonly RF_REPEAT_EVERY_MONTHS: number;
    private eTData;
    constructor();
    private _addMonths;
    private _next;
    addEventTime(eTObj: EventTimeObject): void;
    nextAfter(next: number, startTimestamp: number): number[];
    next(next?: number): number[];
}
export {};
