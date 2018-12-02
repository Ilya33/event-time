import {expect} from 'chai';
import {
    TimeEvents
} from '../lib/timeEvents';



describe('TimeEvents', () => {
    const HOUR: number = 3600000;


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
        let timestamp: number = new Date().getTime() + 16 * 24 * HOUR;
        const testTimestamp: number = timestamp;
        const timeEvents: TimeEvents = new TimeEvents();
        let i: number;

        for (i=0; i<8; i++) {
            timeEvents.addTimeEvent({
                fromTimestamp: timestamp
            });

            timestamp += HOUR;
        }

        const r: number[] = timeEvents.next();

        expect(r).to.be.an('array').that.eql([testTimestamp]);
    });


    it('fromTimestamp, next(16), add 7', () => {
        let timestamp: number = new Date().getTime() + 16 * 24 * HOUR;
        const timeEvents: TimeEvents = new TimeEvents();
        let testTimestamps: number[] = [];
        let i: number;

        for (i=0; i<7; i++) {
            timeEvents.addTimeEvent({
                fromTimestamp: timestamp
            });

            testTimestamps.push(timestamp);

            timestamp += HOUR;
        }

        const r: number[] = timeEvents.next(16);

        expect(r).to.be.an('array').that.eql(testTimestamps);
    });


    it('fromTimestamp, next(16), add 19', () => {
        let timestamp: number = new Date().getTime() + 16 * 24 * HOUR;
        const timeEvents: TimeEvents = new TimeEvents();
        const elementsCount: number = 16;
        let testTimestamps: number[] = [];
        let i: number;

        for (i=0; i<19; i++) {
            timeEvents.addTimeEvent({
                fromTimestamp: timestamp
            });

            testTimestamps.push(timestamp);

            timestamp += HOUR;
        }

        testTimestamps.length = elementsCount;

        const r: number[] = timeEvents.next(elementsCount);

        expect(r).to.be.an('array').that.eql(testTimestamps);
    });


    it('fromTimestamp, next(16), add 16, 3 in the past', () => {
        let timestamp: number = new Date().getTime() - 2.5 * HOUR;
        const timeEvents: TimeEvents = new TimeEvents();
        const elementsCount: number = 16;
        let testTimestamps: number[] = [];
        let i: number;

        for (i=0; i<16; i++) {
            timeEvents.addTimeEvent({
                fromTimestamp: timestamp
            });

            testTimestamps.push(timestamp);

            timestamp += HOUR;
        }

        testTimestamps.shift();
        testTimestamps.shift();
        testTimestamps.shift();

        const r: number[] = timeEvents.next(elementsCount);

        expect(r).to.be.an('array').that.eql(testTimestamps);
    });



    it('fromTimestamp (single), repeatInterval = 0, next(16)', () => {
        let timestamp: number = new Date().getTime() + 16 * 24 * HOUR;
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


    it('fromTimestamp (single), repeatInterval = -5', () => {
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
        let timestamp: number = new Date().getTime() + 16 * 24 * HOUR;
        const interval: number = HOUR;
        const timeEvents: TimeEvents = new TimeEvents();
        const elementsCount: number = 16;

        timeEvents.addTimeEvent({
            fromTimestamp: timestamp,
            repeatInterval: interval
        });

        const r: number[] = timeEvents.next(elementsCount);

        expect(r).to.be.an('array').that.eql(
            (<any>Array(elementsCount)).fill(elementsCount).map(() => {
                let _timestamp: number = timestamp;
                timestamp += interval;
                return _timestamp;
            })
        );
    });


    it('fromTimestamp (single), repeatInterval, next(16), 3 in the past', () => {
        let timestamp: number = new Date().getTime() - 25 * HOUR;
        const interval: number = 10 * HOUR;
        const timeEvents: TimeEvents = new TimeEvents();
        const elementsCount: number = 16;

        timeEvents.addTimeEvent({
            fromTimestamp: timestamp,
            repeatInterval: interval
        });

        const r: number[] = timeEvents.next(elementsCount);

        timestamp += interval * 3;
        expect(r).to.be.an('array').that.eql(
            (<any>Array(elementsCount)).fill(elementsCount).map(() => {
                let _timestamp: number = timestamp;
                timestamp += interval;
                return _timestamp;
            })
        );
    });


    it('fromTimestamp, repeatInterval, next(16)', () => {
        let timestamp: number = new Date().getTime() + 16 * 24 * HOUR;
        const interval: number = HOUR;
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

        for (i=0; i<16; i++) {
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

            timestamp += Math.floor(interval/4);
        }

        testTimestamps.sort((a, b) => a > b ?1 :-1);
        testTimestamps.length = elementsCount;

        const r: number[] = timeEvents.next(elementsCount);

        expect(r).to.be.an('array').that.eql(testTimestamps);
    });


// TODO unique



/*
    it('fromTimestamp, repeatInterval, afterTimestamp, next(16)', function() {
        var timeEvent      = new TimeEvents();
        var timestamp      = 1542738585000;
        var interval       = 3600000;
        var afterTimestamp = (new Date()).getTime();
        var elementsCount  = 16;

        if (afterTimestamp < timestamp)
            afterTimestamp = timestamp + interval;

        timeEvent._setRepeat({
                fromTimestamp: timestamp,
                repeatInterval: interval,
                afterTimestamp: afterTimestamp
        });
        var r = timeEvent.next(elementsCount);

        timestamp += Math.floor((afterTimestamp - timestamp) / interval) * interval;

        expect(r).to.be.an('array').that.eql(
            Array(elementsCount).fill(0).map(function() {
                timestamp += interval;
                return timestamp;
            })
        );
    });*/



    /*it('fromTimestamp, repeatEvery: months = 0 default, next(16)', function() {
        var timeEvent      = new TimeEvents();
        var timestamp      = 1542738585000;
    });*/


/*    it('fromTimestamp, repeatEvery: months default, next(16)', function() {
        var timestamp      = 1542738585000; // Nov 20
        var elementsCount  = 16;
        var resultArray = [];
        var timeEvent;
        var i;

        for (i=1; i<=12; i++) {
            timeEvent = new TimeEvents();

            timeEvent._setRepeat({
                fromTimestamp: timestamp,
                repeatEvery: {
                    months: i
                }
            });

            resultArray[i] = timeEvent.next(elementsCount);
        }

        expect(resultArray).to.be.an('array').that.eql(
            Array(12).fill(0).map(function() {
                Array(elementsCount).fill(0).map(function() {
                    timestamp += 10;
                    return timestamp;
                })
            })
        );
    });*/
});