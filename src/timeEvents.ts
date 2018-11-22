interface _repeatObject {
    fromTimestamp: number;
    afterTimestamp?: number;
    repeatInterval?: number;
    repeatEvery?: any;
}


interface TimeEventsData {
    repeats: {
        _hasRepeatInterval: boolean;
        _hasAfterTimestamp: boolean;

        fromTimestamp: number;
        afterTimestamp: number;
        repeatInterval: number;
    }[];
}



export class TimeEvents {
    private tEData: TimeEventsData = {
        repeats: []
    };

    constructor() {}



    _setRepeat(rObj: _repeatObject) {
        const _hasRepeatInterval: boolean = rObj.hasOwnProperty('repeatInterval') ?true :false;
        const _hasAfterTimestamp: boolean = rObj.hasOwnProperty('afterTimestamp') ?true :false;

        let afterTimestamp: number;
        let repeatInterval: number;


        if (_hasAfterTimestamp) {
            if (undefined === rObj.afterTimestamp)
                throw new Error('The property `afterTimestamp` MUST be a number');

            afterTimestamp = rObj.afterTimestamp;
        }
        else {
            afterTimestamp = 0;
        }


        if (_hasRepeatInterval) {
            if (undefined === rObj.repeatInterval)
                throw new Error('The property `repeatInterval` MUST be a number');

            repeatInterval = rObj.repeatInterval;
        }
        else {
            repeatInterval = 0;
        }


        this.tEData.repeats[0] = {
            _hasRepeatInterval,
            _hasAfterTimestamp,

            fromTimestamp: rObj.fromTimestamp,
            repeatInterval,
            afterTimestamp
        };
    }



    next(n: number = 1): number[] {
        if (0 === this.tEData.repeats.length)
            return [];

        let nextTSs = [];
        let timestamp: number = this.tEData.repeats[0].fromTimestamp;
        const interval: number = this.tEData.repeats[0].repeatInterval;
        let i: number;


        if (true === this.tEData.repeats[0]._hasAfterTimestamp) {
            // generate only new events
            const afterTimestamp: number = this.tEData.repeats[0].afterTimestamp > timestamp
                ?this.tEData.repeats[0].afterTimestamp
                :timestamp;

            timestamp += Math.floor((afterTimestamp - timestamp) / interval) * interval;
        }


        for (i=0; i<n; i++) {
            timestamp += interval;
            nextTSs[i] = timestamp;
        }

        return nextTSs;
    }
}