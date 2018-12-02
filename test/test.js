"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var timeEvents_1 = require("../lib/timeEvents");
describe('TimeEvents', function () {
    var HOUR = 3600000;
    it('empty TimeEvent, next()', function () {
        var timeEvents = new timeEvents_1.TimeEvents();
        var r = timeEvents.next();
        chai_1.expect(r).to.be.an('array').that.is.empty;
    });
    it('empty TimeEvent, next(16)', function () {
        var timeEvents = new timeEvents_1.TimeEvents();
        var r = timeEvents.next(16);
        chai_1.expect(r).to.be.an('array').that.is.empty;
    });
    it('fromTimestamp, next()', function () {
        var timestamp = new Date().getTime() + 16 * 24 * HOUR;
        var testTimestamp = timestamp;
        var timeEvents = new timeEvents_1.TimeEvents();
        var i;
        for (i = 0; i < 8; i++) {
            timeEvents.addTimeEvent({
                fromTimestamp: timestamp
            });
            timestamp += HOUR;
        }
        var r = timeEvents.next();
        chai_1.expect(r).to.be.an('array').that.eql([testTimestamp]);
    });
    it('fromTimestamp, next(16), add 7', function () {
        var timestamp = new Date().getTime() + 16 * 24 * HOUR;
        var timeEvents = new timeEvents_1.TimeEvents();
        var testTimestamps = [];
        var i;
        for (i = 0; i < 7; i++) {
            timeEvents.addTimeEvent({
                fromTimestamp: timestamp
            });
            testTimestamps.push(timestamp);
            timestamp += HOUR;
        }
        var r = timeEvents.next(16);
        chai_1.expect(r).to.be.an('array').that.eql(testTimestamps);
    });
    it('fromTimestamp, next(16), add 19', function () {
        var timestamp = new Date().getTime() + 16 * 24 * HOUR;
        var timeEvents = new timeEvents_1.TimeEvents();
        var elementsCount = 16;
        var testTimestamps = [];
        var i;
        for (i = 0; i < 19; i++) {
            timeEvents.addTimeEvent({
                fromTimestamp: timestamp
            });
            testTimestamps.push(timestamp);
            timestamp += HOUR;
        }
        testTimestamps.length = elementsCount;
        var r = timeEvents.next(elementsCount);
        chai_1.expect(r).to.be.an('array').that.eql(testTimestamps);
    });
    it('fromTimestamp, next(16), add 16, 3 in the past', function () {
        var timestamp = new Date().getTime() - 2.5 * HOUR;
        var timeEvents = new timeEvents_1.TimeEvents();
        var elementsCount = 16;
        var testTimestamps = [];
        var i;
        for (i = 0; i < 16; i++) {
            timeEvents.addTimeEvent({
                fromTimestamp: timestamp
            });
            testTimestamps.push(timestamp);
            timestamp += HOUR;
        }
        testTimestamps.shift();
        testTimestamps.shift();
        testTimestamps.shift();
        var r = timeEvents.next(elementsCount);
        chai_1.expect(r).to.be.an('array').that.eql(testTimestamps);
    });
    it('fromTimestamp (single), repeatInterval = 0, next(16)', function () {
        var timestamp = new Date().getTime() + 16 * 24 * HOUR;
        var interval = 0;
        var timeEvents = new timeEvents_1.TimeEvents();
        var elementsCount = 16;
        timeEvents.addTimeEvent({
            fromTimestamp: timestamp,
            repeatInterval: interval
        });
        var r = timeEvents.next(elementsCount);
        chai_1.expect(r).to.be.an('array').that.eql([timestamp]);
    });
    it('fromTimestamp (single), repeatInterval = -5', function () {
        var timeEvents = new timeEvents_1.TimeEvents();
        var hasError = false;
        try {
            timeEvents.addTimeEvent({
                fromTimestamp: 123456,
                repeatInterval: -5
            });
        }
        catch (e) {
            hasError = true;
        }
        chai_1.expect(hasError).eql(true);
    });
    it('fromTimestamp (single), repeatInterval, next(16)', function () {
        var timestamp = new Date().getTime() + 16 * 24 * HOUR;
        var interval = HOUR;
        var timeEvents = new timeEvents_1.TimeEvents();
        var elementsCount = 16;
        timeEvents.addTimeEvent({
            fromTimestamp: timestamp,
            repeatInterval: interval
        });
        var r = timeEvents.next(elementsCount);
        chai_1.expect(r).to.be.an('array').that.eql(Array(elementsCount).fill(elementsCount).map(function () {
            var _timestamp = timestamp;
            timestamp += interval;
            return _timestamp;
        }));
    });
    it('fromTimestamp (single), repeatInterval, next(16), 3 in the past', function () {
        var timestamp = new Date().getTime() - 25 * HOUR;
        var interval = 10 * HOUR;
        var timeEvents = new timeEvents_1.TimeEvents();
        var elementsCount = 16;
        timeEvents.addTimeEvent({
            fromTimestamp: timestamp,
            repeatInterval: interval
        });
        var r = timeEvents.next(elementsCount);
        timestamp += interval * 3;
        chai_1.expect(r).to.be.an('array').that.eql(Array(elementsCount).fill(elementsCount).map(function () {
            var _timestamp = timestamp;
            timestamp += interval;
            return _timestamp;
        }));
    });
    it('fromTimestamp, repeatInterval, next(16)', function () {
        var timestamp = new Date().getTime() + 16 * 24 * HOUR;
        var interval = HOUR;
        var timeEvents = new timeEvents_1.TimeEvents();
        var elementsCount = 16;
        var testTimestamps = [];
        var i;
        timeEvents.addTimeEvent({
            fromTimestamp: 123456
        });
        for (i = 0; i < 5; i++) {
            timeEvents.addTimeEvent({
                fromTimestamp: timestamp
            });
            testTimestamps.push(timestamp);
            timestamp += interval;
        }
        var _loop_1 = function () {
            timeEvents.addTimeEvent({
                fromTimestamp: timestamp,
                repeatInterval: interval
            });
            var _timestamp = timestamp;
            var _array = Array(elementsCount).fill(0).map(function () {
                var __timestamp = _timestamp;
                _timestamp += interval;
                return __timestamp;
            });
            testTimestamps = testTimestamps.concat(_array);
            timestamp += Math.floor(interval / 4);
        };
        for (i = 0; i < 16; i++) {
            _loop_1();
        }
        testTimestamps.sort(function (a, b) { return a > b ? 1 : -1; });
        testTimestamps.length = elementsCount;
        var r = timeEvents.next(elementsCount);
        chai_1.expect(r).to.be.an('array').that.eql(testTimestamps);
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
