// event-time - Copyright (C) 2018 Ilya Pavlov
// event-time is licensed under the MIT License

interface EventTimeObject {
    fromTimestamp: number;
    repeatInterval?: number;
    repeatEvery?: {
        daysOfWeek?: number[],

        months?: number,
        //timezone for months?
        //TODO add flag skipLastDaysOfMonthTNE?: boolean // ... That Not Equal
    }
}


interface EventTimeData {
    _repeatFlags: number;

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
    readonly ONE_HOUR = 3600000;
    readonly ONE_DAY  = 86400000;
    readonly ONE_WEEK = 604800000;

    readonly RF_NONE                = 0;
    readonly RF_HAS_REPEAT_INTERVAL = 1;
    readonly RF_REPEAT_EVERY_MONTHS = 2;



    private eTData: EventTimeData[] = [];



    constructor() {}



    private _addMonths(dateObj: Date, months: number): Date {
        if (0 === months)
            return new Date(dateObj);

        const mDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        const allMonths: number = dateObj.getMonth() + months;
        const needAddYears: number = Math.floor(allMonths / 12);
        const newMonth = allMonths - needAddYears * 12;
        let dayValue = dateObj.getDate();

        if (dayValue > mDays[ newMonth ]) {
            if (1 !== newMonth) {
                dayValue = mDays[ newMonth ];
            }
            else {
                const year = dateObj.getFullYear() + needAddYears;
                // TODO new Date(year, 1, 29).getDate() === 29; http://javascript-benchmark.info/
                if ( ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0) )
                    dayValue = 29;
                else
                    dayValue = 28;
            }
        }

        let d = new Date(dateObj);
        d.setFullYear(dateObj.getFullYear() + needAddYears, newMonth, dayValue);
        return d;
    }



    private _next(next: number = 1, startTimestamp: number = (new Date().getTime()) ): number[] {
        const eTData: EventTimeData[] = this.eTData;
        let nextTSs: number[] = [];
        let eTDIndex: number;
        let eTDLength: number = eTData.length;

        for (eTDIndex=0; eTDIndex<eTDLength; eTDIndex++) {
            const eventTime: EventTimeData = eTData[eTDIndex];

            if (1 === (eventTime._repeatFlags&this.RF_HAS_REPEAT_INTERVAL)) {
                const repeatInterval = eventTime.repeatInterval;
                let timestamp: number = eventTime.timestamp;

                if (timestamp <= startTimestamp)
                    timestamp = timestamp +
                        Math.floor((startTimestamp - timestamp) / repeatInterval) *
                        repeatInterval + repeatInterval;

                nextTSs.push(timestamp);

                let i: number;
                for (i=1; i<next; i++) {
                    timestamp += repeatInterval;
                    nextTSs.push(timestamp);
                }
            }


            else if (1 === (eventTime._repeatFlags&this.RF_REPEAT_EVERY_MONTHS)) {
                const monthsInterval = eventTime.repeatInterval;
                let timestamp: number = eventTime.timestamp;

                if (eventTime.timestamp <= startTimestamp) {
                    const startTimestampDate = new Date(startTimestamp);
                    const eventTimestampDate = new Date(eventTime.timestamp);
                    const currentMonthsDelta = (startTimestampDate.getFullYear() - eventTimestampDate.getFullYear()) * 12 -
                        eventTimestampDate.getMonth() + startTimestampDate.getMonth();
                    const needMonths = Math.floor(currentMonthsDelta / monthsInterval) + 1;

                    timestamp = this._addMonths(new Date(timestamp), needMonths).getTime();
                }

                nextTSs.push(timestamp);

                let i: number;
                for (i=1; i<next; i++) {
                    timestamp += this._addMonths(new Date(timestamp), monthsInterval).getTime();
                    nextTSs.push(timestamp);
                }
            }


            // _repeatFlags === RF_NONE
            else {
                if (eventTime.timestamp > startTimestamp) {
                    nextTSs.push(eventTime.timestamp);
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
        let _repeatFlags: number = this.RF_NONE;
        let _hasDaysOfMonth: boolean = false;

        let repeatInterval: number = 0;


        if (eTObj.hasOwnProperty('repeatInterval') && undefined !== eTObj.repeatInterval &&
            0 !== eTObj.repeatInterval
        ) {
            repeatInterval = eTObj.repeatInterval;
            if (repeatInterval < 0)
                throw new Error('The `repeatInterval` MUST be >= 0');

            _repeatFlags |= this.RF_HAS_REPEAT_INTERVAL;
        }


        if (eTObj.hasOwnProperty('repeatEvery') && undefined !== eTObj.repeatEvery &&
            0 !== Object.keys( eTObj.repeatEvery ).length
        ) {
            if (1 === (_repeatFlags&this.RF_HAS_REPEAT_INTERVAL))
                throw new Error('You may not specify more than one `repeatInterval` or `repeatEvery` option');


            if (1 !== Object.keys( eTObj.repeatEvery ).length)
                throw new Error('You may not specify more than one `daysOfWeek` or `months` option (not implemented)');


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
                    throw new Error('`daysOfWeek` MUST ba an array with days of week numbers 0-6: days since Sunday');

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


            else if (repeatEvery.hasOwnProperty('months') && undefined !== repeatEvery.months &&
                0 !== repeatEvery.months
            ) {
                _repeatFlags |= this.RF_REPEAT_EVERY_MONTHS;

                repeatInterval = repeatEvery.months;
            }
        }


        this.eTData.push({
            _repeatFlags,

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