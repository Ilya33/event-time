// callbacks-helper-tiny - Copyright (C) 2018 Ilya Pavlov
// callbacks-helper-tiny is licensed under the MIT License

interface TimeEventObject {
    fromTimestamp: number;
    repeatInterval?: number;
}


interface TimeEventsData {
        _hasRepeatInterval: boolean;
//        _hasAfterTimestamp: boolean;

        timestamp: number;
//        afterTimestamp: number;
        repeatInterval: number;
};



export class TimeEvents {
    private tEData: TimeEventsData[] = [];

    constructor() {}



    addTimeEvent(tEObj: TimeEventObject) {
        let _hasRepeatInterval: boolean;
        let repeatInterval: number;

        if (tEObj.hasOwnProperty('repeatInterval') && undefined !== tEObj.repeatInterval &&
            0 !== tEObj.repeatInterval
        ) {
            repeatInterval = tEObj.repeatInterval;
            if (repeatInterval < 0)
                throw new Error('repeatInterval MUST >= 0'); // TODO

            _hasRepeatInterval = true;
        }
        else {
            repeatInterval = 0;

            _hasRepeatInterval = false;
        }


        this.tEData.push({
            _hasRepeatInterval,

            timestamp: tEObj.fromTimestamp,
            repeatInterval
        });
    }



    next(next: number = 1): number[] {
        const currentTimestamp: number = new Date().getTime();
        const tEData: TimeEventsData[] = this.tEData;
        let nextTSs: number[] = [];
        let tEDIndex: number;
        let tEDLength: number = tEData.length;

        for (tEDIndex=0; tEDIndex<tEDLength; tEDIndex++) {
            const timeEvent: TimeEventsData = tEData[tEDIndex];

            if (false === timeEvent._hasRepeatInterval) {
                if (timeEvent.timestamp > currentTimestamp) {
                    nextTSs.push(timeEvent.timestamp);
                }
            }

            else { // true === timeEvent._hasRepeatInterval
                const repeatInterval = timeEvent.repeatInterval;
                let timestamp: number;

                if (timeEvent.timestamp > currentTimestamp)
                    timestamp = timeEvent.timestamp;
                else
                    timestamp = timeEvent.timestamp +
                        Math.floor((currentTimestamp - timeEvent.timestamp) / repeatInterval) *
                        repeatInterval + repeatInterval;

                let i: number;
                for (i=0; i<next; i++) {
                    nextTSs.push(timestamp);
                    timestamp += repeatInterval;
                }
            }
        }

        // TODO uniq
        nextTSs.sort((a, b) => a > b ?1 :-1);

        if (nextTSs.length > next)
            nextTSs.length = next;

        return nextTSs;
    }
}