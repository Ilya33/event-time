import {expect} from 'chai';
import { TimeEvents } from '../lib/timeEvents';



describe('TimeEvents', () => {
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



    it('empty TimeEvent, next()', () => {
        const timeEvents: TimeEvents = new TimeEvents();
        const r: number[] = timeEvents.next();

        expect(r).to.be.an('array').that.is.empty;
    });


    it('empty TimeEvent, next(16)', () => {
        const timeEvents: TimeEvents = new TimeEvents();
        const r: number[] = timeEvents.next(16);

        expect(r).to.be.an('array').that.is.empty;
    });



    it('fromTimestamp, next()', () => {
        let timestamp: number = new Date().getTime() + 8 * 24 * ONE_HOUR;
        const testTimestamp: number = timestamp;
        const timeEvents: TimeEvents = new TimeEvents();
        let i: number;

        for (i=0; i<8; i++) {
            timeEvents.addTimeEvent({
                fromTimestamp: timestamp
            });

            timestamp += ONE_HOUR;
        }

        const r: number[] = timeEvents.next();

        expect(r).to.be.an('array').that.eql([testTimestamp]);
    });


    it('fromTimestamp, next(16), add 7', () => {
        let timestamp: number = new Date().getTime() + 8 * 24 * ONE_HOUR;
        const timeEvents: TimeEvents = new TimeEvents();
        let testTimestamps: number[] = [];
        let i: number;

        for (i=0; i<7; i++) {
            timeEvents.addTimeEvent({
                fromTimestamp: timestamp
            });

            testTimestamps.push(timestamp);

            timestamp += ONE_HOUR;
        }

        const r: number[] = timeEvents.next(16);

        expect(r).to.be.an('array').that.eql(testTimestamps);
    });


    it('fromTimestamp, next(16), add 19', () => {
        let timestamp: number = new Date().getTime() + 8 * 24 * ONE_HOUR;
        const timeEvents: TimeEvents = new TimeEvents();
        const elementsCount: number = 16;
        let testTimestamps: number[] = [];
        let i: number;

        for (i=0; i<19; i++) {
            timeEvents.addTimeEvent({
                fromTimestamp: timestamp
            });

            testTimestamps.push(timestamp);

            timestamp += ONE_HOUR;
        }

        testTimestamps.length = elementsCount;

        const r: number[] = timeEvents.next(elementsCount);

        expect(r).to.be.an('array').that.eql(testTimestamps);
    });


    it('fromTimestamp, next(16), add 16, 3 in the past', () => {
        let timestamp: number = new Date().getTime() - 2.5 * ONE_HOUR;
        const timeEvents: TimeEvents = new TimeEvents();
        const elementsCount: number = 16;
        let testTimestamps: number[] = [];
        let i: number;

        for (i=0; i<16; i++) {
            timeEvents.addTimeEvent({
                fromTimestamp: timestamp
            });

            testTimestamps.push(timestamp);

            timestamp += ONE_HOUR;
        }

        testTimestamps.shift();
        testTimestamps.shift();
        testTimestamps.shift();

        const r: number[] = timeEvents.next(elementsCount);

        expect(r).to.be.an('array').that.eql(testTimestamps);
    });



    it('fromTimestamp (single), repeatInterval = 0, next(16)', () => {
        let timestamp: number = new Date().getTime() + 8 * 24 * ONE_HOUR;
        const interval: number = 0;
        const timeEvents: TimeEvents = new TimeEvents();
        const elementsCount: number = 16;

        timeEvents.addTimeEvent({
            fromTimestamp: timestamp,
            repeatInterval: interval
        });

        const r: number[] = timeEvents.next(elementsCount);

        expect(r).to.be.an('array').that.eql([timestamp]);
    });


    it('fromTimestamp (single), repeatInterval = -5 (error)', () => {
        const timeEvents: TimeEvents = new TimeEvents();
        let hasError: boolean = false;

        try {
            timeEvents.addTimeEvent({
                fromTimestamp: 123456,
                repeatInterval: -5
            });
        }
        catch(e) {
            hasError = true;
        }

        expect(hasError).eql(true);
    });


    it('fromTimestamp (single), repeatInterval, next(16)', () => {
        let timestamp: number = new Date().getTime() + 8 * 24 * ONE_HOUR;
        const interval: number = ONE_HOUR;
        const timeEvents: TimeEvents = new TimeEvents();
        const elementsCount: number = 16;

        timeEvents.addTimeEvent({
            fromTimestamp: timestamp,
            repeatInterval: interval
        });

        const r: number[] = timeEvents.next(elementsCount);

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
        const timeEvents: TimeEvents = new TimeEvents();
        const elementsCount: number = 16;

        timeEvents.addTimeEvent({
            fromTimestamp: timestamp,
            repeatInterval: interval
        });

        const r: number[] = timeEvents.next(elementsCount);

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
        let timestamp: number = new Date().getTime() + 8 * 24 * ONE_HOUR;
        const interval: number = ONE_HOUR;
        const timeEvents: TimeEvents = new TimeEvents();
        const elementsCount: number = 16;
        let testTimestamps: number[] = [];

        timeEvents.addTimeEvent({
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

        timeEvents.addTimeEvent({
            fromTimestamp: anotherTimestamp,
            repeatInterval: interval
        });

        const r: number[] = timeEvents.next(elementsCount);

        expect(r).to.be.an('array').that.eql(testTimestamps);
    });


    it('fromTimestamp, repeatInterval, next(16)', () => {
        let timestamp: number = new Date().getTime() + 8 * 24 * ONE_HOUR;
        const interval: number = ONE_HOUR;
        const timeEvents: TimeEvents = new TimeEvents();
        const elementsCount: number = 16;
        let testTimestamps: number[] = [];
        let i: number;

        timeEvents.addTimeEvent({
            fromTimestamp: 123456
        });

        for (i=0; i<5; i++) {
            timeEvents.addTimeEvent({
                fromTimestamp: timestamp
            });

            testTimestamps.push(timestamp);
            timestamp += interval;
        }

        for (i=0; i<4; i++) {
            timeEvents.addTimeEvent({
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

        const r: number[] = timeEvents.next(elementsCount);

        expect(r).to.be.an('array').that.eql(testTimestamps);
    });



    it('fromTimestamp, repeatInterval, nextAfter(16)', () => {
        let timestamp: number = new Date().getTime() + 8 * 24 * ONE_HOUR;
        const interval: number = 2 * ONE_HOUR;
        const timeEvents: TimeEvents = new TimeEvents();
        const elementsCount: number = 16;
        const startTimestamp: number = timestamp + ONE_HOUR;
        const addTimeEventsCount: number = 2;
        let testTimestamps: number[] = [];
        let i: number;

        timeEvents.addTimeEvent({
            fromTimestamp: 123456
        });

        for (i=0; i<addTimeEventsCount; i++) {
            timeEvents.addTimeEvent({
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


        const results: number[] = timeEvents.nextAfter(elementsCount, startTimestamp);

        testTimestamps = uniq(testTimestamps);
        testTimestamps = testTimestamps.filter((el) => {
            return el > startTimestamp;
        });
        testTimestamps.sort((a, b) => a > b ?1 :-1);
        testTimestamps.length = elementsCount;

        expect(results).to.be.an('array').that.eql(testTimestamps);
    });



    it('fromTimestamp, repeatInterval and repeatEvery (error)', () => {
        const timeEvents: TimeEvents = new TimeEvents();
        let hasError: boolean = false;

        try {
            timeEvents.addTimeEvent({
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


    it('fromTimestamp, repeatEvery daysOfWeek and daysOfMonth (not implemented)', () => {
        const timeEvents: TimeEvents = new TimeEvents();
        let hasError: boolean = false;

        try {
            timeEvents.addTimeEvent({
                fromTimestamp: 123456,
                repeatEvery: {
                    daysOfWeek: [0],
                    daysOfMonth: [2]
                }
            });
        }
        catch(e) {
            hasError = true;
        }

        expect(hasError).eql(true);
    });


    it('fromTimestamp, repeatEvery daysOfWeek (error)', () => {
        const timeEvents: TimeEvents = new TimeEvents();
        let hasError: boolean = false;

        try {
            timeEvents.addTimeEvent({
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
        const timeEvents: TimeEvents = new TimeEvents();
        let hasError: boolean = false;

        try {
            timeEvents.addTimeEvent({
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
        let timestamp: number = new Date().getTime() + 8 * 24 * ONE_HOUR;
        const tsDay = new Date(timestamp).getDay();
        const timeEvents: TimeEvents = new TimeEvents();
        const elementsCount: number = 16;
        let testTimestamps: number[] = [];

        timeEvents.addTimeEvent({
            fromTimestamp: timestamp,
            repeatEvery: {
                daysOfWeek: [tsDay]
            }
        });


        const results: number[] = timeEvents.next(elementsCount);

        testTimestamps = (<any>Array(elementsCount)).fill(0).map(() => {
            let _timestamp: number = timestamp;
            timestamp += ONE_WEEK;
            return _timestamp;
        });

        expect(results).to.be.an('array').that.eql(testTimestamps);
    });


    it('fromTimestamp, repeatEvery daysOfWeek, tsDay < daysOfWeek[n], next(16)', () => {
        let timestamp: number = 1544516091479; // Tue Dec 11 2018 08:14:51 GMT+0000
        const tsDay = new Date(timestamp).getDay();
        const timeEvents: TimeEvents = new TimeEvents();
        const elementsCount: number = 16;
        let testTimestamps: number[] = [];

        timeEvents.addTimeEvent({
            fromTimestamp: timestamp,
            repeatEvery: {
                daysOfWeek: [4]
            }
        });


        const results: number[] = timeEvents.next(elementsCount);

        timestamp += 2 * ONE_DAY;

        testTimestamps = (<any>Array(elementsCount)).fill(0).map(() => {
            let _timestamp: number = timestamp;
            timestamp += ONE_WEEK;
            return _timestamp;
        });

        expect(results).to.be.an('array').that.eql(testTimestamps);
    });


    /*it('fromTimestamp, repeatEvery daysOfWeek, tsDay > daysOfWeek[n], next(16)', () => {
        let timestamp: number = 1544516091479 + 3 * ONE_DAY; // Thu Dec 13 2018 08:14:51 GMT + 3 * ONE_DAY
        const tsDay = new Date(timestamp).getDay();
        const timeEvents: TimeEvents = new TimeEvents();
        const elementsCount: number = 16;
        let testTimestamps: number[] = [];

        timeEvents.addTimeEvent({
            fromTimestamp: timestamp,
            repeatEvery: {
                daysOfWeek: [3]
            }
        });


        const results: number[] = timeEvents.next(elementsCount);

        timestamp -= 2 * ONE_DAY;

        testTimestamps = (<any>Array(elementsCount)).fill(0).map(() => {
            let _timestamp: number = timestamp;
            timestamp += ONE_WEEK;
            return _timestamp;
        });

        expect(results).to.be.an('array').that.eql(testTimestamps);
    });*/
});