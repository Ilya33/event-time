interface TimeEventObject {
    fromTimestamp: number;
    repeatInterval?: number;
}
export declare class TimeEvents {
    private tEData;
    constructor();
    addTimeEvent(tEObj: TimeEventObject): void;
    next(next?: number): number[];
}
export {};
