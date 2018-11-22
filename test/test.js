'use strict';

var expect = require('chai').expect;
var TimeEvents = require('../lib/timeEvents.js').TimeEvents;



describe('TimeEvent', function() {
    it('empty TimeEvent, next()', function() {
        var timeEvent = new TimeEvents();
        var r = timeEvent.next();

        expect(r).to.be.an('array').that.is.empty;
    });


    it('empty TimeEvent, next(16)', function() {
        var timeEvent = new TimeEvents();
        var r = timeEvent.next(16);

        expect(r).to.be.an('array').that.is.empty;
    });



    it('fromTimestamp & repeatInterval, next()', function() {
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
    });



    /*it('fromTimestamp, repeatEvery: months = 0 default, next(16)', function() {
        var timeEvent      = new TimeEvents();
        var timestamp      = 1542738585000;
    });*/


    /*it('fromTimestamp, repeatEvery: months default, next(16)', function() {
        var timeEvent      = new TimeEvents();
        var timestamp      = 1542738585000; // Nov 20
        var elementsCount  = 16;
        var i;

        for (i=1; i<=12; i++) {
            timeEvent._setRepeat({
                fromTimestamp: timestamp,
                repeatEvery: {
                    months: 2
                }
            });
        }

        var r = timeEvent.next(elementsCount);

        timestamp += Math.floor((afterTimestamp - timestamp) / interval) * interval;

        expect(r).to.be.an('array').that.eql(
            Array(elementsCount).fill(0).map(function() {
                timestamp += interval;
                return timestamp;
            })
        );
    });*/
});