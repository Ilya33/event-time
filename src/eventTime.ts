// event-time - Copyright (C) 2018 Ilya Pavlov
// event-time is licensed under the MIT License

interface EventTimeObject {
    fromTimestamp: number;
    repeatInterval?: number;
    repeatEvery?: {
        daysOfWeek?: number[],
//        daysOfMonth?: number[]
    }
}


interface EventTimeData {
    _hasRepeatInterval: boolean;

    timestamp: number;
    repeatInterval: number;
};



const uniq = (a: any[]): any[] => {
    let obj = Object.create(null);
    let i: number;
    let l: number = a.length;

    for (i=0; i<l; i++)
        obj[ a[i] ] = a[i];

    // ES-2017 Object.values
    return Object.keys(obj).map(k => {
        return obj[k];
    });
};



export class EventTime {
    readonly ONE_DAY  = 86400000;
    readonly ONE_WEEK = 604800000;



    private eTData: EventTimeData[] = [];



    constructor() {}



    private _next(next: number = 1, startTimestamp: number = (new Date().getTime()) ): number[] {
        const eTData: EventTimeData[] = this.eTData;
        let nextTSs: number[] = [];
        let eTDIndex: number;
        let eTDLength: number = eTData.length;

        for (eTDIndex=0; eTDIndex<eTDLength; eTDIndex++) {
            const eventTime: EventTimeData = eTData[eTDIndex];

            if (false === eventTime._hasRepeatInterval) {
                if (eventTime.timestamp > startTimestamp) {
                    nextTSs.push(eventTime.timestamp);
                }
            }

            else { // true === eventTime._hasRepeatInterval
                const repeatInterval = eventTime.repeatInterval;
                let timestamp: number;

                if (eventTime.timestamp > startTimestamp)
                    timestamp = eventTime.timestamp;
                else
                    timestamp = eventTime.timestamp +
                        Math.floor((startTimestamp - eventTime.timestamp) / repeatInterval) *
                        repeatInterval + repeatInterval;

                let i: number;
                for (i=0; i<next; i++) {
                    nextTSs.push(timestamp);
                    timestamp += repeatInterval;
                }
            }
        }


        nextTSs = uniq(nextTSs);

        nextTSs.sort((a, b) => a > b ?1 :-1);
        if (nextTSs.length > next)
            nextTSs.length = next;

        return nextTSs;
    }



    public addEventTime(eTObj: EventTimeObject) {
        let _hasRepeatInterval: boolean;
        let repeatInterval: number;

        if (eTObj.hasOwnProperty('repeatInterval') && undefined !== eTObj.repeatInterval &&
            0 !== eTObj.repeatInterval
        ) {
            repeatInterval = eTObj.repeatInterval;
            if (repeatInterval < 0)
                throw new Error('The `repeatInterval` MUST be >= 0');

            _hasRepeatInterval = true;
        }
        else {
            repeatInterval = 0;

            _hasRepeatInterval = false;
        }


        if (eTObj.hasOwnProperty('repeatEvery') && undefined !== eTObj.repeatEvery &&
            0 !== Object.keys( eTObj.repeatEvery ).length
        ) {
            if (true == _hasRepeatInterval)
                throw new Error('You may not specify more than one `repeatInterval` or `repeatEvery` option');


            if (1 !== Object.keys( eTObj.repeatEvery ).length)
                throw new Error('You may not specify more than one `daysOfWeek` or `daysOfMonth` option (not implemented)');


            const repeatEvery = eTObj.repeatEvery;
            if (repeatEvery.hasOwnProperty('daysOfWeek') && undefined !== repeatEvery.daysOfWeek &&
                0 !== repeatEvery.daysOfWeek.length
            ) {
                const days = uniq(repeatEvery.daysOfWeek);
                let l: number = days.length;
                let i: number;

                if (l !== days.filter(el =>
                    el === 0 || el === 1 || el === 2 || el === 3 || el === 4 ||
                    el === 5 || el === 6
                ).length)
                    throw new Error('`days` MUST ba an array with days of week numbers 0-6: days since Sunday');

                const tsDay = new Date(eTObj.fromTimestamp).getDay();
                for (i=0; i<l; i++) {
                    let d = days[i] - tsDay;

                    if (d < 0)
                        d += 7;

                    this.addEventTime({
                        fromTimestamp: eTObj.fromTimestamp + d * this.ONE_DAY,
                        repeatInterval: this.ONE_WEEK
                    });
                }

                return;
            }
        }


        this.eTData.push({
            _hasRepeatInterval,

            timestamp: eTObj.fromTimestamp,
            repeatInterval
        });
    }



    public nextAfter(next: number, startTimestamp: number): number[] {
        return this._next(next, startTimestamp);
    }

    public next(next: number = 1): number[] {
        return this._next(next);
    }
}