interface _repeatObject {
    fromTimestamp: number;
    afterTimestamp?: number;
    repeatInterval?: number;
    repeatEvery?: any;
}
export declare class TimeEvents {
    private tEData;
    constructor();
    _setRepeat(rObj: _repeatObject): void;
    next(n?: number): number[];
}
export {};
