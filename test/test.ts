import {expect} from 'chai'; // add chai date?
import { EventTime } from '../lib/eventTime';



describe('EventTime', () => {
    const ONE_HOUR: number = 3600000;
    const ONE_DAY: number  = 86400000;
    const ONE_WEEK: number = 604800000;



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



    it('empty EventTime, next()', () => {
        const eventTime: EventTime = new EventTime();
        const r: number[] = eventTime.next();

        expect(r).to.be.an('array').that.is.empty;
    });


    it('empty EventTime, next(16)', () => {
        const eventTime: EventTime = new EventTime();
        const r: number[] = eventTime.next(16);

        expect(r).to.be.an('array').that.is.empty;
    });



    it('fromTimestamp, next()', () => {
        let timestamp: number = new Date().getTime() + ONE_WEEK;
        const testTimestamp: number = timestamp;
        const eventTime: EventTime = new EventTime();
        let i: number;

        for (i=0; i<8; i++) {
            eventTime.addEventTime({
                fromTimestamp: timestamp
            });

            timestamp += ONE_HOUR;
        }

        const r: number[] = eventTime.next();

        expect(r).to.be.an('array').that.eql([testTimestamp]);
    });


    it('fromTimestamp, next(16), add 7', () => {
        let timestamp: number = new Date().getTime() + ONE_WEEK;
        const eventTime: EventTime = new EventTime();
        let testTimestamps: number[] = [];
        let i: number;

        for (i=0; i<7; i++) {
            eventTime.addEventTime({
                fromTimestamp: timestamp
            });

            testTimestamps.push(timestamp);

            timestamp += ONE_HOUR;
        }

        const r: number[] = eventTime.next(16);

        expect(r).to.be.an('array').that.eql(testTimestamps);
    });


    it('fromTimestamp, next(16), add 19', () => {
        let timestamp: number = new Date().getTime() + ONE_WEEK;
        const eventTime: EventTime = new EventTime();
        const elementsCount: number = 16;
        let testTimestamps: number[] = [];
        let i: number;

        for (i=0; i<19; i++) {
            eventTime.addEventTime({
                fromTimestamp: timestamp
            });

            testTimestamps.push(timestamp);

            timestamp += ONE_HOUR;
        }

        testTimestamps.length = elementsCount;

        const r: number[] = eventTime.next(elementsCount);

        expect(r).to.be.an('array').that.eql(testTimestamps);
    });


    it('fromTimestamp, next(16), unique', () => {
        let timestamp: number = new Date().getTime() + ONE_WEEK;
        const eventTime: EventTime = new EventTime();
        const elementsCount: number = 16;
        const testTimestamps: number[] = [
            timestamp,
            timestamp + 1024,
            timestamp + 2048,
        ];
        let i: number;

        for (i=0; i<8; i++) {
            eventTime.addEventTime({
                fromTimestamp: testTimestamps[0]
            });

            eventTime.addEventTime({
                fromTimestamp: testTimestamps[1]
            });

            eventTime.addEventTime({
                fromTimestamp:  testTimestamps[2]
            });
        }

        const r: number[] = eventTime.next(elementsCount);

        expect(r).to.be.an('array').that.eql(testTimestamps);
    });


    it('fromTimestamp, next(16), add 16, 3 in the past', () => {
        let timestamp: number = new Date().getTime() - 2.5 * ONE_HOUR;
        const eventTime: EventTime = new EventTime();
        const elementsCount: number = 16;
        let testTimestamps: number[] = [];
        let i: number;

        for (i=0; i<16; i++) {
            eventTime.addEventTime({
                fromTimestamp: timestamp
            });

            testTimestamps.push(timestamp);

            timestamp += ONE_HOUR;
        }

        testTimestamps.shift();
        testTimestamps.shift();
        testTimestamps.shift();

        const r: number[] = eventTime.next(elementsCount);

        expect(r).to.be.an('array').that.eql(testTimestamps);
    });



    it('fromTimestamp (single), repeatInterval = 0, next(16)', () => {
        let timestamp: number = new Date().getTime() + ONE_WEEK;
        const interval: number = 0;
        const eventTime: EventTime = new EventTime();
        const elementsCount: number = 16;

        eventTime.addEventTime({
            fromTimestamp: timestamp,
            repeatInterval: interval
        });

        const r: number[] = eventTime.next(elementsCount);

        expect(r).to.be.an('array').that.eql([timestamp]);
    });


    it('fromTimestamp (single), repeatInterval = -5 (error)', () => {
        const eventTime: EventTime = new EventTime();
        let hasError: boolean = false;

        try {
            eventTime.addEventTime({
                fromTimestamp: 123456,
                repeatInterval: -5
            });
        }
        catch(e) {
            hasError = true;
        }

        expect(hasError).eql(true);
    });


    // TODO repeatInterval is float


    it('fromTimestamp (single), repeatInterval, next(16)', () => {
        let timestamp: number = new Date().getTime() + ONE_WEEK;
        const interval: number = ONE_HOUR;
        const eventTime: EventTime = new EventTime();
        const elementsCount: number = 16;

        eventTime.addEventTime({
            fromTimestamp: timestamp,
            repeatInterval: interval
        });

        const r: number[] = eventTime.next(elementsCount);

        expect(r).to.be.an('array').that.eql(
            (<any>Array(elementsCount)).fill(0).map(() => {
                let _timestamp: number = timestamp;
                timestamp += interval;
                return _timestamp;
            })
        );
    });


    it('fromTimestamp (single), repeatInterval, next(16), 3 in the past', () => {
        let timestamp: number = new Date().getTime() - 25 * ONE_HOUR;
        const interval: number = 10 * ONE_HOUR;
        const eventTime: EventTime = new EventTime();
        const elementsCount: number = 16;

        eventTime.addEventTime({
            fromTimestamp: timestamp,
            repeatInterval: interval
        });

        const r: number[] = eventTime.next(elementsCount);

        timestamp += interval * 3;
        expect(r).to.be.an('array').that.eql(
            (<any>Array(elementsCount)).fill(0).map(() => {
                let _timestamp: number = timestamp;
                timestamp += interval;
                return _timestamp;
            })
        );
    });


    it('fromTimestamp, repeatInterval, next(16), unique', () => {
        let timestamp: number = new Date().getTime() + ONE_WEEK;
        const interval: number = ONE_HOUR;
        const eventTime: EventTime = new EventTime();
        const elementsCount: number = 16;
        let testTimestamps: number[] = [];

        eventTime.addEventTime({
            fromTimestamp: timestamp,
            repeatInterval: interval
        });

        timestamp -= interval - interval;
        const anotherTimestamp = timestamp;

        testTimestamps = (<any>Array(elementsCount)).fill(0).map(() => {
            let _timestamp: number = timestamp;
            timestamp += interval;
            return _timestamp;
        });

        timestamp += interval + interval;

        eventTime.addEventTime({
            fromTimestamp: anotherTimestamp,
            repeatInterval: interval
        });

        const r: number[] = eventTime.next(elementsCount);

        expect(r).to.be.an('array').that.eql(testTimestamps);
    });


    it('fromTimestamp, repeatInterval, next(16)', () => {
        let timestamp: number = new Date().getTime() + ONE_WEEK;
        const interval: number = ONE_HOUR;
        const eventTime: EventTime = new EventTime();
        const elementsCount: number = 16;
        let testTimestamps: number[] = [];
        let i: number;

        eventTime.addEventTime({
            fromTimestamp: 123456
        });

        for (i=0; i<5; i++) {
            eventTime.addEventTime({
                fromTimestamp: timestamp
            });

            testTimestamps.push(timestamp);
            timestamp += interval;
        }

        for (i=0; i<4; i++) {
            eventTime.addEventTime({
                fromTimestamp: timestamp,
                repeatInterval: interval
            });

            let _timestamp: number = timestamp;
            const _array: number[] = (<any>Array(elementsCount)).fill(0).map(() => {
                let __timestamp: number = _timestamp;
                _timestamp += interval;
                return __timestamp;
            });

            testTimestamps = [...testTimestamps, ..._array];

            timestamp += 10000;
        }

        testTimestamps = uniq(testTimestamps);
        testTimestamps.sort((a, b) => a > b ?1 :-1);
        testTimestamps.length = elementsCount;

        const r: number[] = eventTime.next(elementsCount);

        expect(r).to.be.an('array').that.eql(testTimestamps);
    });



    it('fromTimestamp, repeatInterval, nextAfter(16)', () => {
        let timestamp: number = new Date().getTime() + ONE_WEEK;
        const interval: number = 2 * ONE_HOUR;
        const eventTime: EventTime = new EventTime();
        const elementsCount: number = 16;
        const startTimestamp: number = timestamp + ONE_HOUR;
        const addEventTimesCount: number = 2;
        let testTimestamps: number[] = [];
        let i: number;

        eventTime.addEventTime({
            fromTimestamp: 123456
        });

        for (i=0; i<addEventTimesCount; i++) {
            eventTime.addEventTime({
                fromTimestamp: timestamp,
                repeatInterval: interval
            });

            let _timestamp: number = timestamp;
            const _array: number[] = (<any>Array(elementsCount)).fill(0).map(() => {
                let __timestamp: number = _timestamp;
                _timestamp += interval;
                return __timestamp;
            });

            testTimestamps = [...testTimestamps, ..._array];

            timestamp += 10000;
        }


        const results: number[] = eventTime.nextAfter(elementsCount, startTimestamp);

        testTimestamps = uniq(testTimestamps);
        testTimestamps = testTimestamps.filter((el) => {
            return el > startTimestamp;
        });
        testTimestamps.sort((a, b) => a > b ?1 :-1);
        testTimestamps.length = elementsCount;

        expect(results).to.be.an('array').that.eql(testTimestamps);
    });



    it('fromTimestamp, repeatInterval and repeatEvery (error)', () => {
        const eventTime: EventTime = new EventTime();
        let hasError: boolean = false;

        try {
            eventTime.addEventTime({
                fromTimestamp: 123456,
                repeatInterval: 1,
                repeatEvery: {
                    daysOfWeek: [0]
                }
            });
        }
        catch(e) {
            hasError = true;
        }

        expect(hasError).eql(true);
    });


    it('fromTimestamp, repeatEvery daysOfWeek and months (not implemented)', () => {
        const eventTime: EventTime = new EventTime();
        let hasError: boolean = false;

        try {
            eventTime.addEventTime({
                fromTimestamp: 123456,
                repeatEvery: {
                    daysOfWeek: [0],
                    months: 11
                }
            });
        }
        catch(e) {
            hasError = true;
        }

        expect(hasError).eql(true);
    });


    it('fromTimestamp, repeatEvery daysOfWeek (error)', () => {
        const eventTime: EventTime = new EventTime();
        let hasError: boolean = false;

        try {
            eventTime.addEventTime({
                fromTimestamp: 123456,
                repeatEvery: {
                    daysOfWeek: [24]
                }
            });
        }
        catch(e) {
            hasError = true;
        }

        expect(hasError).eql(true);
    });


    it('fromTimestamp, repeatEvery daysOfWeek (error) 1', () => {
        const eventTime: EventTime = new EventTime();
        let hasError: boolean = false;

        try {
            eventTime.addEventTime({
                fromTimestamp: 123456,
                repeatEvery: {
                    daysOfWeek: [4.000004]
                }
            });
        }
        catch(e) {
            hasError = true;
        }

        expect(hasError).eql(true);
    });


    it('fromTimestamp, repeatEvery daysOfWeek, tsDay === daysOfWeek[n], next(16)', () => {
        let timestamp: number = new Date().getTime() + ONE_WEEK;
        const tsDay = new Date(timestamp).getDay();
        const eventTime: EventTime = new EventTime();
        const elementsCount: number = 16;
        let testTimestamps: number[] = [];

        eventTime.addEventTime({
            fromTimestamp: timestamp,
            repeatEvery: {
                daysOfWeek: [tsDay]
            }
        });


        const results: number[] = eventTime.next(elementsCount);

        testTimestamps = (<any>Array(elementsCount)).fill(0).map(() => {
            let _timestamp: number = timestamp;
            timestamp += ONE_WEEK;
            return _timestamp;
        });

        testTimestamps = uniq(testTimestamps);
        testTimestamps.sort((a, b) => a > b ?1 :-1);
        testTimestamps.length = elementsCount;

        expect(results).to.be.an('array').that.eql(testTimestamps);
    });


    it('fromTimestamp, repeatEvery daysOfWeek, tsDay < daysOfWeek[n], next(16)', () => {
        let timestamp: number = 1544516091479; // Tue Dec 11 2018 08:14:51 GMT+0000
        const tsDay = new Date(timestamp).getDay();
        const eventTime: EventTime = new EventTime();
        const elementsCount: number = 16;
        let testTimestamps: number[] = [];

        const currentTimestamp = new Date().getTime();
        if (currentTimestamp > timestamp)
            timestamp += Math.floor((currentTimestamp - timestamp) / ONE_WEEK) * ONE_WEEK;
        timestamp += 2 * ONE_WEEK;

        eventTime.addEventTime({
            fromTimestamp: timestamp,
            repeatEvery: {
                daysOfWeek: [4]
            }
        });

        const results: number[] = eventTime.next(elementsCount);

        timestamp += 2 * ONE_DAY;

        testTimestamps = (<any>Array(elementsCount)).fill(0).map(() => {
            let _timestamp: number = timestamp;
            timestamp += ONE_WEEK;
            return _timestamp;
        });

        testTimestamps = uniq(testTimestamps);
        testTimestamps.sort((a, b) => a > b ?1 :-1);
        testTimestamps.length = elementsCount;

        expect(results).to.be.an('array').that.eql(testTimestamps);
    });


    it('fromTimestamp, repeatEvery daysOfWeek, tsDay > daysOfWeek[n], next(16)', () => {
        let timestamp: number = 1544516091479 + 3 * ONE_DAY; // Thu Dec 13 2018 08:14:51 GMT + 3 * ONE_DAY
        const tsDay = new Date(timestamp).getDay();
        const eventTime: EventTime = new EventTime();
        const elementsCount: number = 16;
        let testTimestamps: number[] = [];

        const currentTimestamp = new Date().getTime();
        if (currentTimestamp > timestamp)
            timestamp += Math.floor((currentTimestamp - timestamp) / ONE_WEEK) * ONE_WEEK;
        timestamp += 2 * ONE_WEEK;

        eventTime.addEventTime({
            fromTimestamp: timestamp,
            repeatEvery: {
                daysOfWeek: [3]
            }
        });

        const results: number[] = eventTime.next(elementsCount);

        // Fri: 5 (+0), Sat: 6 (+1), Sun: 0 (+2), Mon: 1 (+3), Thu: 2 (+4), Wed: 3 (+5)
        timestamp += 5 * ONE_DAY;

        testTimestamps = (<any>Array(elementsCount)).fill(0).map(() => {
            let _timestamp: number = timestamp;
            timestamp += ONE_WEEK;
            return _timestamp;
        });

        testTimestamps = uniq(testTimestamps);
        testTimestamps.sort((a, b) => a > b ?1 :-1);
        testTimestamps.length = elementsCount;

        expect(results).to.be.an('array').that.eql(testTimestamps);
    });


    it('fromTimestamp, repeatEvery daysOfWeek, daysOfWeek[n, ...], next(16)', () => {
        let timestamp: number = 1544516091479 + ONE_DAY; // Thu Dec 13 2018 08:14:51 GMT + ONE_DAY
        const tsDay = new Date(timestamp).getDay();
        const eventTime: EventTime = new EventTime();
        const elementsCount: number = 16;
        let testTimestamps: number[] = [];
        const testDaysOfWeek = [1, 3, 6];

        const currentTimestamp = new Date().getTime();
        if (currentTimestamp > timestamp)
            timestamp += Math.floor((currentTimestamp - timestamp) / ONE_WEEK) * ONE_WEEK;
        timestamp += 2 * ONE_WEEK;

        eventTime.addEventTime({
            fromTimestamp: timestamp,
            repeatEvery: {
                daysOfWeek: testDaysOfWeek
            }
        });

        const results: number[] = eventTime.next(elementsCount);

        testDaysOfWeek.forEach((day) => {
            let loopTimestamp = timestamp;
            let d = day - tsDay;

            if (d < 0)
                d += 7;

            loopTimestamp += d * ONE_DAY;

            const _array = (<any>Array(elementsCount)).fill(0).map(() => {
                let _timestamp: number = loopTimestamp;
                loopTimestamp += ONE_WEEK;
                return _timestamp;
            });

            testTimestamps = [...testTimestamps, ..._array];
        });

        testTimestamps = uniq(testTimestamps);
        testTimestamps.sort((a, b) => a > b ?1 :-1);
        testTimestamps.length = elementsCount;

        expect(results).to.be.an('array').that.eql(testTimestamps);
    });


    it('fromTimestamp, repeatEvery daysOfWeek, daysOfWeek[n, ...], next(16), few in the past', () => {
        let timestamp: number = new Date().getTime() - ONE_WEEK - 8 * ONE_HOUR;
        const tsDay = new Date(timestamp).getDay();
        const eventTime: EventTime = new EventTime();
        const elementsCount: number = 16;
        let testTimestamps: number[] = [];
        const testDaysOfWeek = [1, 2, 5];

        eventTime.addEventTime({
            fromTimestamp: timestamp,
            repeatEvery: {
                daysOfWeek: testDaysOfWeek
            }
        });

        const results: number[] = eventTime.next(elementsCount);

        testDaysOfWeek.forEach((day) => {
            let loopTimestamp = timestamp;
            let d = day - tsDay;

            if (d < 0)
                d += 7;

            loopTimestamp += d * ONE_DAY;

            const _array = (<any>Array(elementsCount + 7 * 3)).fill(0).map(() => {
                let _timestamp: number = loopTimestamp;
                loopTimestamp += ONE_WEEK;
                return _timestamp;
            });

            testTimestamps = [...testTimestamps, ..._array];
        });

        testTimestamps = uniq(testTimestamps);

        const currentTimestamp = new Date().getTime();
        testTimestamps = testTimestamps.filter((el) => {
            return el > currentTimestamp;
        });

        testTimestamps.sort((a, b) => a > b ?1 :-1);
        testTimestamps.length = elementsCount;

        expect(results).to.be.an('array').that.eql(testTimestamps);
    });


    it('fromTimestamp, repeatEvery daysOfWeek, daysOfWeek[n, ...], nextAfter(16), few in the past', () => {
        let timestamp: number = new Date().getTime() - ONE_WEEK - 8 * ONE_HOUR;
        const tsDay = new Date(timestamp).getDay();
        const eventTime: EventTime = new EventTime();
        const elementsCount: number = 16;
        let testTimestamps: number[] = [];
        const testDaysOfWeek = [1, 2, 5];

        eventTime.addEventTime({
            fromTimestamp: timestamp,
            repeatEvery: {
                daysOfWeek: testDaysOfWeek
            }
        });

        const startTimestamp = new Date().getTime() + ONE_DAY;
        const results: number[] = eventTime.nextAfter(elementsCount, startTimestamp);

        testDaysOfWeek.forEach((day) => {
            let loopTimestamp = timestamp;
            let d = day - tsDay;

            if (d < 0)
                d += 7;

            loopTimestamp += d * ONE_DAY;

            const _array = (<any>Array(elementsCount + 7 * 3)).fill(0).map(() => {
                let _timestamp: number = loopTimestamp;
                loopTimestamp += ONE_WEEK;
                return _timestamp;
            });

            testTimestamps = [...testTimestamps, ..._array];
        });

        testTimestamps = uniq(testTimestamps);

        testTimestamps = testTimestamps.filter((el) => {
            return el > startTimestamp;
        });

        testTimestamps.sort((a, b) => a > b ?1 :-1);
        testTimestamps.length = elementsCount;

        expect(results).to.be.an('array').that.eql(testTimestamps);
    });


    it('fromTimestamp, repeatInterval, repeatEvery daysOfWeek, next(16)', () => {
        let timestamp: number = new Date().getTime() - ONE_WEEK - 8 * ONE_HOUR;
        const tsDay = new Date(timestamp).getDay();
        const eventTime: EventTime = new EventTime();
        const elementsCount: number = 16;
        let testTimestamps: number[] = [];
        const testDaysOfWeek = [1, 2, 5];
        const currentTimestamp = new Date().getTime();

        eventTime.addEventTime({
            fromTimestamp: currentTimestamp + 4 * ONE_HOUR,
        });

        testTimestamps = [ currentTimestamp + 4 * ONE_HOUR ];


        let loopTimestamp = currentTimestamp - ONE_HOUR;
        let loopRepeatInterval = 2 * ONE_HOUR;

        eventTime.addEventTime({
            fromTimestamp: loopTimestamp,
            repeatInterval: loopRepeatInterval
        });

        const _array = (<any>Array(elementsCount + 7 * 3)).fill(0).map(() => {
            let _timestamp: number = loopTimestamp;
            loopTimestamp += loopRepeatInterval;
            return _timestamp;
        });

        testTimestamps = [...testTimestamps, ..._array];


        eventTime.addEventTime({
            fromTimestamp: timestamp,
            repeatEvery: {
                daysOfWeek: testDaysOfWeek
            }
        });

        const results: number[] = eventTime.next(elementsCount);


        testDaysOfWeek.forEach((day) => {
            let loopTimestamp = timestamp;
            let d = day - tsDay;

            if (d < 0)
                d += 7;

            loopTimestamp += d * ONE_DAY;

            const _array = (<any>Array(elementsCount + 7 * 3)).fill(0).map(() => {
                let _timestamp: number = loopTimestamp;
                loopTimestamp += ONE_WEEK;
                return _timestamp;
            });

            testTimestamps = [...testTimestamps, ..._array];
        });

        testTimestamps = uniq(testTimestamps);

        testTimestamps = testTimestamps.filter((el) => {
            return el > currentTimestamp;
        });

        testTimestamps.sort((a, b) => a > b ?1 :-1);
        testTimestamps.length = elementsCount;

        expect(results).to.be.an('array').that.eql(testTimestamps);
    });



    it('fromTimestamp, repeatInterval, repeatEvery daysOfWeek, nextAfter(16)', () => {
        let timestamp: number = new Date().getTime() - ONE_WEEK - 8 * ONE_HOUR;
        const tsDay = new Date(timestamp).getDay();
        const eventTime: EventTime = new EventTime();
        const elementsCount: number = 16;
        let testTimestamps: number[] = [];
        const testDaysOfWeek = [2, 3];
        const startTimestamp = new Date().getTime() + 2 * ONE_HOUR;

        eventTime.addEventTime({
            fromTimestamp: startTimestamp + 4 * ONE_HOUR,
        });

        testTimestamps = [ startTimestamp + 4 * ONE_HOUR ];


        let loopTimestamp = startTimestamp - ONE_HOUR;
        let loopRepeatInterval = 2 * ONE_HOUR;

        eventTime.addEventTime({
            fromTimestamp: loopTimestamp,
            repeatInterval: loopRepeatInterval
        });

        const _array = (<any>Array(elementsCount + 7 * 3)).fill(0).map(() => {
            let _timestamp: number = loopTimestamp;
            loopTimestamp += loopRepeatInterval;
            return _timestamp;
        });

        testTimestamps = [...testTimestamps, ..._array];


        eventTime.addEventTime({
            fromTimestamp: timestamp,
            repeatEvery: {
                daysOfWeek: testDaysOfWeek
            }
        });

        const results: number[] = eventTime.nextAfter(elementsCount, startTimestamp);


        testDaysOfWeek.forEach((day) => {
            let loopTimestamp = timestamp;
            let d = day - tsDay;

            if (d < 0)
                d += 7;

            loopTimestamp += d * ONE_DAY;

            const _array = (<any>Array(elementsCount + 7 * 3)).fill(0).map(() => {
                let _timestamp: number = loopTimestamp;
                loopTimestamp += ONE_WEEK;
                return _timestamp;
            });

            testTimestamps = [...testTimestamps, ..._array];
        });

        testTimestamps = uniq(testTimestamps);

        testTimestamps = testTimestamps.filter((el) => {
            return el > startTimestamp;
        });

        testTimestamps.sort((a, b) => a > b ?1 :-1);
        testTimestamps.length = elementsCount;

        expect(results).to.be.an('array').that.eql(testTimestamps);
    });



    it('dirty private _addMonths test', () => {
        const eventTime: EventTime = new EventTime();
        const dirtyPrivateMethod: any = eventTime['_addMonths'];


        const date0 = new Date(2018, 0, 1);
        const date0Timestamp = date0.getTime();

        const expectedDates0: Date[] = [
            new Date(2018, 0, 1), // +0
            new Date(2018, 1, 1), // +1
            new Date(2018, 2, 1), // +2
            new Date(2018, 3, 1), // +3
            new Date(2018, 4, 1), // +4
            new Date(2018, 5, 1), // +5
            new Date(2018, 11, 1), // +11
            new Date(2019, 0, 1), // +12
            new Date(2019, 1, 1), // +13
            new Date(2020, 2, 1), // +26
            new Date(2021, 3, 1), // +39
            new Date(2022, 4, 1), // +52
            new Date(2023, 5, 1), // +65
        ];

        let results0: Date[] = [];

        results0.push( dirtyPrivateMethod(new Date(date0Timestamp), 0) );
        results0.push( dirtyPrivateMethod(new Date(date0Timestamp), 1) );
        results0.push( dirtyPrivateMethod(new Date(date0Timestamp), 2) );
        results0.push( dirtyPrivateMethod(new Date(date0Timestamp), 3) );
        results0.push( dirtyPrivateMethod(new Date(date0Timestamp), 4) );
        results0.push( dirtyPrivateMethod(new Date(date0Timestamp), 5) );
        results0.push( dirtyPrivateMethod(new Date(date0Timestamp), 11) );
        results0.push( dirtyPrivateMethod(new Date(date0Timestamp), 12) );
        results0.push( dirtyPrivateMethod(new Date(date0Timestamp), 13) );
        results0.push( dirtyPrivateMethod(new Date(date0Timestamp), 26) );
        results0.push( dirtyPrivateMethod(new Date(date0Timestamp), 39) );
        results0.push( dirtyPrivateMethod(new Date(date0Timestamp), 52) );
        results0.push( dirtyPrivateMethod(new Date(date0Timestamp), 65) );


        const date1 = new Date(2018, 0, 31);
        const date1Timestamp = date1.getTime();

        const expectedDates1: Date[] = [
            new Date(2018, 0, 31), // +0
            new Date(2018, 1, 28), // +1
            new Date(2018, 2, 31), // +2
            new Date(2018, 3, 30), // +3
            new Date(2019, 1, 28), // +13
            new Date(2019, 2, 31), // +14
            new Date(2019, 3, 30), // +15
            new Date(2020, 1, 29), // +25
            new Date(2021, 1, 28), // +37
            new Date(2021, 2, 31), // +38
        ];

        let results1: Date[] = [];

        results1.push( dirtyPrivateMethod(new Date(date1Timestamp), 0) );
        results1.push( dirtyPrivateMethod(new Date(date1Timestamp), 1) );
        results1.push( dirtyPrivateMethod(new Date(date1Timestamp), 2) );
        results1.push( dirtyPrivateMethod(new Date(date1Timestamp), 3) );
        results1.push( dirtyPrivateMethod(new Date(date1Timestamp), 13) );
        results1.push( dirtyPrivateMethod(new Date(date1Timestamp), 14) );
        results1.push( dirtyPrivateMethod(new Date(date1Timestamp), 15) );
        results1.push( dirtyPrivateMethod(new Date(date1Timestamp), 25) );
        results1.push( dirtyPrivateMethod(new Date(date1Timestamp), 37) );
        results1.push( dirtyPrivateMethod(new Date(date1Timestamp), 38) );


        const date2 = new Date(2018, 3, 30);
        const date2Timestamp = date2.getTime();

        const expectedDates2: Date[] = [
            new Date(2018, 3, 30), // +0
            new Date(2018, 4, 30), // +1
            new Date(2018, 5, 30), // +2
            new Date(2018, 6, 30), // +3
            new Date(2019, 1, 28), // +10
            new Date(2019, 2, 30), // +11
            new Date(2019, 3, 30), // +12
            new Date(2020, 1, 29), // +22
            new Date(2021, 1, 28), // +34
            new Date(2021, 2, 30), // +35
        ];

        let results2: Date[] = [];

        results2.push( dirtyPrivateMethod(new Date(date2Timestamp), 0) );
        results2.push( dirtyPrivateMethod(new Date(date2Timestamp), 1) );
        results2.push( dirtyPrivateMethod(new Date(date2Timestamp), 2) );
        results2.push( dirtyPrivateMethod(new Date(date2Timestamp), 3) );
        results2.push( dirtyPrivateMethod(new Date(date2Timestamp), 10) );
        results2.push( dirtyPrivateMethod(new Date(date2Timestamp), 11) );
        results2.push( dirtyPrivateMethod(new Date(date2Timestamp), 12) );
        results2.push( dirtyPrivateMethod(new Date(date2Timestamp), 22) );
        results2.push( dirtyPrivateMethod(new Date(date2Timestamp), 34) );
        results2.push( dirtyPrivateMethod(new Date(date2Timestamp), 35) );


        expect( results0.map(el => el.getTime()) ).eql( expectedDates0.map(el => el.getTime()) );
        expect( results1.map(el => el.getTime()) ).eql( expectedDates1.map(el => el.getTime()) );
        expect( results2.map(el => el.getTime()) ).eql( expectedDates2.map(el => el.getTime()) );
    });



    it('fromTimestamp, repeatEvery months = 0, next(16)', () => {
        let timestamp: number = new Date().getTime() + ONE_WEEK;
        const eventTime: EventTime = new EventTime();
        const elementsCount: number = 16;

        eventTime.addEventTime({
            fromTimestamp: timestamp,
            repeatEvery: {
                months: 0
            }
        });


        const results: number[] = eventTime.next(elementsCount);

        expect(results).to.be.an('array').that.eql([timestamp]);
    });


    /*it('fromTimestamp, repeatEvery months, next', () => {
        let d = new Date();
        let timestamp: number = (d.setFullYear(d.getFullYear() + 2, 0, 1)).getTime();
        const eventTime: EventTime = new EventTime();
        const elementsCount: number = 16;
        let testTimestamps: number[] = [];

        eventTime.addEventTime({
            fromTimestamp: timestamp,
            repeatEvery: {
                months: 1
            }
        });


        const results: number[] = eventTime.next(elementsCount);

        testTimestamps = (<any>Array(elementsCount)).fill(0).map(() => {
            let _timestamp: number = timestamp;
            timestamp += ONE_WEEK;
            return _timestamp;
        });

        testTimestamps = uniq(testTimestamps);
        testTimestamps.sort((a, b) => a > b ?1 :-1);
        testTimestamps.length = elementsCount;

        expect(results).to.be.an('array').that.eql(testTimestamps);
    });*/
});