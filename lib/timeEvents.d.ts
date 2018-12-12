interface TimeEventObject {
    fromTimestamp: number;
    repeatInterval?: number;
}
export declare class TimeEvents {
    private tEData;
    constructor();
    private _next;
    addTimeEvent(tEObj: TimeEventObject): void;
    nextAfter(next: number, startTimestamp: number): number[];
    next(next?: number): number[];
}
export {};
