interface _repeatObject {
    fromTimestamp: number;
    afterTimestamp?: number;
    repeatInterval: number;
}


interface TimeEventsData {
    repeats: _repeatObject[];
}



export class TimeEvents {
    private tEData: TimeEventsData = {
        repeats: []
    };

    constructor() {}



    _setRepeat(rObj: _repeatObject) {
        this.tEData.repeats = [rObj];
    }



    next(n: number = 1): number[] {
        if (0 === this.tEData.repeats.length)
            return [];

        let nextTSs = [];
        let timestamp: number = this.tEData.repeats[0].fromTimestamp;
        const interval: number = this.tEData.repeats[0].repeatInterval;
        let i: number;

        if (this.tEData.repeats[0].hasOwnProperty('afterTimestamp')) {
            const _afterTimestamp: number | undefined = this.tEData.repeats[0].afterTimestamp;
            let afterTimestamp: number;

            if (undefined === _afterTimestamp) {
                throw new Error('The property `afterTimestamp` MUST be a number');
            }
            else {
                // generate only new events
                afterTimestamp = _afterTimestamp > timestamp ?_afterTimestamp :timestamp;

                timestamp += Math.floor((afterTimestamp - timestamp) / interval) * interval;
            }
        }

        for (i=0; i<n; i++) {
            timestamp += interval;
            nextTSs[i] = timestamp;
        }

        return nextTSs;
    }
}