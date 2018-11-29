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
        const needTimestamps = 16;
        let testTimestamps: number[] = [];
        let i: number;

        for (i=0; i<19; i++) {
            timeEvents.addTimeEvent({
                fromTimestamp: timestamp
            });

            testTimestamps.push(timestamp);

            timestamp += HOUR;
        }

        testTimestamps.length = needTimestamps;

        const r: number[] = timeEvents.next(needTimestamps);

        expect(r).to.be.an('array').that.eql(testTimestamps);
    });


    it('fromTimestamp, next(16), add 16, 3 in the past', () => {
        let timestamp: number = new Date().getTime() - 2.5 * HOUR;
        const timeEvents: TimeEvents = new TimeEvents();
        const needTimestamps = 16;
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

        const r: number[] = timeEvents.next(needTimestamps);

        expect(r).to.be.an('array').that.eql(testTimestamps);
    });



/*    it('fromTimestamp & repeatInterval, next()', function() {
        var timeEvent = new TimeEvents();
        var timestamp = 1542738585000;
        var interval  = 3600000;

        timeEvent._setRepeat({
                fromTimestamp: timestamp,
                repeatInterval: interval
        });
        var r = timeEvent.next();

        expect(r).to.be.an('array').that.eql([timestamp + interval]);
    });


    it('fromTimestamp & repeatInterval, next(16)', function() {
        var timeEvent = new TimeEvents();
        var timestamp = 1542738585000;
        var interval  = 3600000;
        var elementsCount = 16;

        timeEvent._setRepeat({
                fromTimestamp: timestamp,
                repeatInterval: interval
        });
        var r = timeEvent.next(elementsCount);

        expect(r).to.be.an('array').that.eql(
            Array(elementsCount).fill(0).map(function() {
                timestamp += interval;
                return timestamp;
            })
        );
    });



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