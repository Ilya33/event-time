"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var timeEvents_1 = require("../lib/timeEvents");
describe('TimeEvents', function () {
    var ONE_HOUR = 3600000;
    var ONE_DAY = 86400000;
    var ONE_WEEK = 604800000;
    var uniq = function (a) {
        var obj = Object.create(null);
        var i;
        var l = a.length;
        for (i = 0; i < l; i++)
            obj[a[i]] = a[i];
        // ES-2017 Object.values
        return Object.keys(obj).map(function (k) {
            return obj[k];
        });
    };
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
        var timestamp = new Date().getTime() + ONE_WEEK;
        var testTimestamp = timestamp;
        var timeEvents = new timeEvents_1.TimeEvents();
        var i;
        for (i = 0; i < 8; i++) {
            timeEvents.addTimeEvent({
                fromTimestamp: timestamp
            });
            timestamp += ONE_HOUR;
        }
        var r = timeEvents.next();
        chai_1.expect(r).to.be.an('array').that.eql([testTimestamp]);
    });
    it('fromTimestamp, next(16), add 7', function () {
        var timestamp = new Date().getTime() + ONE_WEEK;
        var timeEvents = new timeEvents_1.TimeEvents();
        var testTimestamps = [];
        var i;
        for (i = 0; i < 7; i++) {
            timeEvents.addTimeEvent({
                fromTimestamp: timestamp
            });
            testTimestamps.push(timestamp);
            timestamp += ONE_HOUR;
        }
        var r = timeEvents.next(16);
        chai_1.expect(r).to.be.an('array').that.eql(testTimestamps);
    });
    it('fromTimestamp, next(16), add 19', function () {
        var timestamp = new Date().getTime() + ONE_WEEK;
        var timeEvents = new timeEvents_1.TimeEvents();
        var elementsCount = 16;
        var testTimestamps = [];
        var i;
        for (i = 0; i < 19; i++) {
            timeEvents.addTimeEvent({
                fromTimestamp: timestamp
            });
            testTimestamps.push(timestamp);
            timestamp += ONE_HOUR;
        }
        testTimestamps.length = elementsCount;
        var r = timeEvents.next(elementsCount);
        chai_1.expect(r).to.be.an('array').that.eql(testTimestamps);
    });
    it('fromTimestamp, next(16), add 16, 3 in the past', function () {
        var timestamp = new Date().getTime() - 2.5 * ONE_HOUR;
        var timeEvents = new timeEvents_1.TimeEvents();
        var elementsCount = 16;
        var testTimestamps = [];
        var i;
        for (i = 0; i < 16; i++) {
            timeEvents.addTimeEvent({
                fromTimestamp: timestamp
            });
            testTimestamps.push(timestamp);
            timestamp += ONE_HOUR;
        }
        testTimestamps.shift();
        testTimestamps.shift();
        testTimestamps.shift();
        var r = timeEvents.next(elementsCount);
        chai_1.expect(r).to.be.an('array').that.eql(testTimestamps);
    });
    it('fromTimestamp (single), repeatInterval = 0, next(16)', function () {
        var timestamp = new Date().getTime() + ONE_WEEK;
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
    it('fromTimestamp (single), repeatInterval = -5 (error)', function () {
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
        var timestamp = new Date().getTime() + ONE_WEEK;
        var interval = ONE_HOUR;
        var timeEvents = new timeEvents_1.TimeEvents();
        var elementsCount = 16;
        timeEvents.addTimeEvent({
            fromTimestamp: timestamp,
            repeatInterval: interval
        });
        var r = timeEvents.next(elementsCount);
        chai_1.expect(r).to.be.an('array').that.eql(Array(elementsCount).fill(0).map(function () {
            var _timestamp = timestamp;
            timestamp += interval;
            return _timestamp;
        }));
    });
    it('fromTimestamp (single), repeatInterval, next(16), 3 in the past', function () {
        var timestamp = new Date().getTime() - 25 * ONE_HOUR;
        var interval = 10 * ONE_HOUR;
        var timeEvents = new timeEvents_1.TimeEvents();
        var elementsCount = 16;
        timeEvents.addTimeEvent({
            fromTimestamp: timestamp,
            repeatInterval: interval
        });
        var r = timeEvents.next(elementsCount);
        timestamp += interval * 3;
        chai_1.expect(r).to.be.an('array').that.eql(Array(elementsCount).fill(0).map(function () {
            var _timestamp = timestamp;
            timestamp += interval;
            return _timestamp;
        }));
    });
    it('fromTimestamp, repeatInterval, next(16), unique', function () {
        var timestamp = new Date().getTime() + ONE_WEEK;
        var interval = ONE_HOUR;
        var timeEvents = new timeEvents_1.TimeEvents();
        var elementsCount = 16;
        var testTimestamps = [];
        timeEvents.addTimeEvent({
            fromTimestamp: timestamp,
            repeatInterval: interval
        });
        timestamp -= interval - interval;
        var anotherTimestamp = timestamp;
        testTimestamps = Array(elementsCount).fill(0).map(function () {
            var _timestamp = timestamp;
            timestamp += interval;
            return _timestamp;
        });
        timestamp += interval + interval;
        timeEvents.addTimeEvent({
            fromTimestamp: anotherTimestamp,
            repeatInterval: interval
        });
        var r = timeEvents.next(elementsCount);
        chai_1.expect(r).to.be.an('array').that.eql(testTimestamps);
    });
    it('fromTimestamp, repeatInterval, next(16)', function () {
        var timestamp = new Date().getTime() + ONE_WEEK;
        var interval = ONE_HOUR;
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
            timestamp += 10000;
        };
        for (i = 0; i < 4; i++) {
            _loop_1();
        }
        testTimestamps = uniq(testTimestamps);
        testTimestamps.sort(function (a, b) { return a > b ? 1 : -1; });
        testTimestamps.length = elementsCount;
        var r = timeEvents.next(elementsCount);
        chai_1.expect(r).to.be.an('array').that.eql(testTimestamps);
    });
    it('fromTimestamp, repeatInterval, nextAfter(16)', function () {
        var timestamp = new Date().getTime() + ONE_WEEK;
        var interval = 2 * ONE_HOUR;
        var timeEvents = new timeEvents_1.TimeEvents();
        var elementsCount = 16;
        var startTimestamp = timestamp + ONE_HOUR;
        var addTimeEventsCount = 2;
        var testTimestamps = [];
        var i;
        timeEvents.addTimeEvent({
            fromTimestamp: 123456
        });
        var _loop_2 = function () {
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
            timestamp += 10000;
        };
        for (i = 0; i < addTimeEventsCount; i++) {
            _loop_2();
        }
        var results = timeEvents.nextAfter(elementsCount, startTimestamp);
        testTimestamps = uniq(testTimestamps);
        testTimestamps = testTimestamps.filter(function (el) {
            return el > startTimestamp;
        });
        testTimestamps.sort(function (a, b) { return a > b ? 1 : -1; });
        testTimestamps.length = elementsCount;
        chai_1.expect(results).to.be.an('array').that.eql(testTimestamps);
    });
    it('fromTimestamp, repeatInterval and repeatEvery (error)', function () {
        var timeEvents = new timeEvents_1.TimeEvents();
        var hasError = false;
        try {
            timeEvents.addTimeEvent({
                fromTimestamp: 123456,
                repeatInterval: 1,
                repeatEvery: {
                    daysOfWeek: [0]
                }
            });
        }
        catch (e) {
            hasError = true;
        }
        chai_1.expect(hasError).eql(true);
    });
    /*    it('fromTimestamp, repeatEvery daysOfWeek and daysOfMonth (not implemented)', () => {
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
        });*/
    it('fromTimestamp, repeatEvery daysOfWeek (error)', function () {
        var timeEvents = new timeEvents_1.TimeEvents();
        var hasError = false;
        try {
            timeEvents.addTimeEvent({
                fromTimestamp: 123456,
                repeatEvery: {
                    daysOfWeek: [24]
                }
            });
        }
        catch (e) {
            hasError = true;
        }
        chai_1.expect(hasError).eql(true);
    });
    it('fromTimestamp, repeatEvery daysOfWeek (error) 1', function () {
        var timeEvents = new timeEvents_1.TimeEvents();
        var hasError = false;
        try {
            timeEvents.addTimeEvent({
                fromTimestamp: 123456,
                repeatEvery: {
                    daysOfWeek: [4.000004]
                }
            });
        }
        catch (e) {
            hasError = true;
        }
        chai_1.expect(hasError).eql(true);
    });
    it('fromTimestamp, repeatEvery daysOfWeek, tsDay === daysOfWeek[n], next(16)', function () {
        var timestamp = new Date().getTime() + ONE_WEEK;
        var tsDay = new Date(timestamp).getDay();
        var timeEvents = new timeEvents_1.TimeEvents();
        var elementsCount = 16;
        var testTimestamps = [];
        timeEvents.addTimeEvent({
            fromTimestamp: timestamp,
            repeatEvery: {
                daysOfWeek: [tsDay]
            }
        });
        var results = timeEvents.next(elementsCount);
        testTimestamps = Array(elementsCount).fill(0).map(function () {
            var _timestamp = timestamp;
            timestamp += ONE_WEEK;
            return _timestamp;
        });
        testTimestamps = uniq(testTimestamps);
        testTimestamps.sort(function (a, b) { return a > b ? 1 : -1; });
        testTimestamps.length = elementsCount;
        chai_1.expect(results).to.be.an('array').that.eql(testTimestamps);
    });
    it('fromTimestamp, repeatEvery daysOfWeek, tsDay < daysOfWeek[n], next(16)', function () {
        var timestamp = 1544516091479; // Tue Dec 11 2018 08:14:51 GMT+0000
        var tsDay = new Date(timestamp).getDay();
        var timeEvents = new timeEvents_1.TimeEvents();
        var elementsCount = 16;
        var testTimestamps = [];
        var currentTimestamp = new Date().getTime();
        if (currentTimestamp > timestamp)
            timestamp += Math.floor((currentTimestamp - timestamp) / ONE_WEEK) * ONE_WEEK;
        timestamp += 2 * ONE_WEEK;
        timeEvents.addTimeEvent({
            fromTimestamp: timestamp,
            repeatEvery: {
                daysOfWeek: [4]
            }
        });
        var results = timeEvents.next(elementsCount);
        timestamp += 2 * ONE_DAY;
        testTimestamps = Array(elementsCount).fill(0).map(function () {
            var _timestamp = timestamp;
            timestamp += ONE_WEEK;
            return _timestamp;
        });
        testTimestamps = uniq(testTimestamps);
        testTimestamps.sort(function (a, b) { return a > b ? 1 : -1; });
        testTimestamps.length = elementsCount;
        chai_1.expect(results).to.be.an('array').that.eql(testTimestamps);
    });
    it('fromTimestamp, repeatEvery daysOfWeek, tsDay > daysOfWeek[n], next(16)', function () {
        var timestamp = 1544516091479 + 3 * ONE_DAY; // Thu Dec 13 2018 08:14:51 GMT + 3 * ONE_DAY
        var tsDay = new Date(timestamp).getDay();
        var timeEvents = new timeEvents_1.TimeEvents();
        var elementsCount = 16;
        var testTimestamps = [];
        var currentTimestamp = new Date().getTime();
        if (currentTimestamp > timestamp)
            timestamp += Math.floor((currentTimestamp - timestamp) / ONE_WEEK) * ONE_WEEK;
        timestamp += 2 * ONE_WEEK;
        timeEvents.addTimeEvent({
            fromTimestamp: timestamp,
            repeatEvery: {
                daysOfWeek: [3]
            }
        });
        var results = timeEvents.next(elementsCount);
        // Fri: 5 (+0), Sat: 6 (+1), Sun: 0 (+2), Mon: 1 (+3), Thu: 2 (+4), Wed: 3 (+5)
        timestamp += 5 * ONE_DAY;
        testTimestamps = Array(elementsCount).fill(0).map(function () {
            var _timestamp = timestamp;
            timestamp += ONE_WEEK;
            return _timestamp;
        });
        testTimestamps = uniq(testTimestamps);
        testTimestamps.sort(function (a, b) { return a > b ? 1 : -1; });
        testTimestamps.length = elementsCount;
        chai_1.expect(results).to.be.an('array').that.eql(testTimestamps);
    });
    it('fromTimestamp, repeatEvery daysOfWeek, daysOfWeek[n, ...], next(16)', function () {
        var timestamp = 1544516091479 + ONE_DAY; // Thu Dec 13 2018 08:14:51 GMT + ONE_DAY
        var tsDay = new Date(timestamp).getDay();
        var timeEvents = new timeEvents_1.TimeEvents();
        var elementsCount = 16;
        var testTimestamps = [];
        var testDaysOfWeek = [1, 3, 6];
        var currentTimestamp = new Date().getTime();
        if (currentTimestamp > timestamp)
            timestamp += Math.floor((currentTimestamp - timestamp) / ONE_WEEK) * ONE_WEEK;
        timestamp += 2 * ONE_WEEK;
        timeEvents.addTimeEvent({
            fromTimestamp: timestamp,
            repeatEvery: {
                daysOfWeek: testDaysOfWeek
            }
        });
        var results = timeEvents.next(elementsCount);
        testDaysOfWeek.forEach(function (day) {
            var loopTimestamp = timestamp;
            var d = day - tsDay;
            if (d < 0)
                d += 7;
            loopTimestamp += d * ONE_DAY;
            var _array = Array(elementsCount).fill(0).map(function () {
                var _timestamp = loopTimestamp;
                loopTimestamp += ONE_WEEK;
                return _timestamp;
            });
            testTimestamps = testTimestamps.concat(_array);
        });
        testTimestamps = uniq(testTimestamps);
        testTimestamps.sort(function (a, b) { return a > b ? 1 : -1; });
        testTimestamps.length = elementsCount;
        chai_1.expect(results).to.be.an('array').that.eql(testTimestamps);
    });
    it('fromTimestamp, repeatEvery daysOfWeek, daysOfWeek[n, ...], next(16), few in the past', function () {
        var timestamp = new Date().getTime() - ONE_WEEK - 8 * ONE_HOUR;
        var tsDay = new Date(timestamp).getDay();
        var timeEvents = new timeEvents_1.TimeEvents();
        var elementsCount = 16;
        var testTimestamps = [];
        var testDaysOfWeek = [1, 2, 5];
        timeEvents.addTimeEvent({
            fromTimestamp: timestamp,
            repeatEvery: {
                daysOfWeek: testDaysOfWeek
            }
        });
        var results = timeEvents.next(elementsCount);
        testDaysOfWeek.forEach(function (day) {
            var loopTimestamp = timestamp;
            var d = day - tsDay;
            if (d < 0)
                d += 7;
            loopTimestamp += d * ONE_DAY;
            var _array = Array(elementsCount + 7 * 3).fill(0).map(function () {
                var _timestamp = loopTimestamp;
                loopTimestamp += ONE_WEEK;
                return _timestamp;
            });
            testTimestamps = testTimestamps.concat(_array);
        });
        testTimestamps = uniq(testTimestamps);
        var currentTimestamp = new Date().getTime();
        testTimestamps = testTimestamps.filter(function (el) {
            return el > currentTimestamp;
        });
        testTimestamps.sort(function (a, b) { return a > b ? 1 : -1; });
        testTimestamps.length = elementsCount;
        chai_1.expect(results).to.be.an('array').that.eql(testTimestamps);
    });
    it('fromTimestamp, repeatEvery daysOfWeek, daysOfWeek[n, ...], nextAfter(16), few in the past', function () {
        var timestamp = new Date().getTime() - ONE_WEEK - 8 * ONE_HOUR;
        var tsDay = new Date(timestamp).getDay();
        var timeEvents = new timeEvents_1.TimeEvents();
        var elementsCount = 16;
        var testTimestamps = [];
        var testDaysOfWeek = [1, 2, 5];
        timeEvents.addTimeEvent({
            fromTimestamp: timestamp,
            repeatEvery: {
                daysOfWeek: testDaysOfWeek
            }
        });
        var startTimestamp = new Date().getTime() + ONE_DAY;
        var results = timeEvents.nextAfter(elementsCount, startTimestamp);
        testDaysOfWeek.forEach(function (day) {
            var loopTimestamp = timestamp;
            var d = day - tsDay;
            if (d < 0)
                d += 7;
            loopTimestamp += d * ONE_DAY;
            var _array = Array(elementsCount + 7 * 3).fill(0).map(function () {
                var _timestamp = loopTimestamp;
                loopTimestamp += ONE_WEEK;
                return _timestamp;
            });
            testTimestamps = testTimestamps.concat(_array);
        });
        testTimestamps = uniq(testTimestamps);
        testTimestamps = testTimestamps.filter(function (el) {
            return el > startTimestamp;
        });
        testTimestamps.sort(function (a, b) { return a > b ? 1 : -1; });
        testTimestamps.length = elementsCount;
        chai_1.expect(results).to.be.an('array').that.eql(testTimestamps);
    });
    it('fromTimestamp, repeatInterval, repeatEvery daysOfWeek, next(16)', function () {
        var timestamp = new Date().getTime() - ONE_WEEK - 8 * ONE_HOUR;
        var tsDay = new Date(timestamp).getDay();
        var timeEvents = new timeEvents_1.TimeEvents();
        var elementsCount = 16;
        var testTimestamps = [];
        var testDaysOfWeek = [1, 2, 5];
        var currentTimestamp = new Date().getTime();
        timeEvents.addTimeEvent({
            fromTimestamp: currentTimestamp + 4 * ONE_HOUR,
        });
        testTimestamps = [currentTimestamp + 4 * ONE_HOUR];
        var loopTimestamp = currentTimestamp - ONE_HOUR;
        var loopRepeatInterval = 2 * ONE_HOUR;
        timeEvents.addTimeEvent({
            fromTimestamp: loopTimestamp,
            repeatInterval: loopRepeatInterval
        });
        var _array = Array(elementsCount + 7 * 3).fill(0).map(function () {
            var _timestamp = loopTimestamp;
            loopTimestamp += loopRepeatInterval;
            return _timestamp;
        });
        testTimestamps = testTimestamps.concat(_array);
        timeEvents.addTimeEvent({
            fromTimestamp: timestamp,
            repeatEvery: {
                daysOfWeek: testDaysOfWeek
            }
        });
        var results = timeEvents.next(elementsCount);
        testDaysOfWeek.forEach(function (day) {
            var loopTimestamp = timestamp;
            var d = day - tsDay;
            if (d < 0)
                d += 7;
            loopTimestamp += d * ONE_DAY;
            var _array = Array(elementsCount + 7 * 3).fill(0).map(function () {
                var _timestamp = loopTimestamp;
                loopTimestamp += ONE_WEEK;
                return _timestamp;
            });
            testTimestamps = testTimestamps.concat(_array);
        });
        testTimestamps = uniq(testTimestamps);
        testTimestamps = testTimestamps.filter(function (el) {
            return el > currentTimestamp;
        });
        testTimestamps.sort(function (a, b) { return a > b ? 1 : -1; });
        testTimestamps.length = elementsCount;
        chai_1.expect(results).to.be.an('array').that.eql(testTimestamps);
    });
    it('fromTimestamp, repeatInterval, repeatEvery daysOfWeek, nextAfter(16)', function () {
        var timestamp = new Date().getTime() - ONE_WEEK - 8 * ONE_HOUR;
        var tsDay = new Date(timestamp).getDay();
        var timeEvents = new timeEvents_1.TimeEvents();
        var elementsCount = 16;
        var testTimestamps = [];
        var testDaysOfWeek = [2, 3];
        var startTimestamp = new Date().getTime() + 2 * ONE_HOUR;
        timeEvents.addTimeEvent({
            fromTimestamp: startTimestamp + 4 * ONE_HOUR,
        });
        testTimestamps = [startTimestamp + 4 * ONE_HOUR];
        var loopTimestamp = startTimestamp - ONE_HOUR;
        var loopRepeatInterval = 2 * ONE_HOUR;
        timeEvents.addTimeEvent({
            fromTimestamp: loopTimestamp,
            repeatInterval: loopRepeatInterval
        });
        var _array = Array(elementsCount + 7 * 3).fill(0).map(function () {
            var _timestamp = loopTimestamp;
            loopTimestamp += loopRepeatInterval;
            return _timestamp;
        });
        testTimestamps = testTimestamps.concat(_array);
        timeEvents.addTimeEvent({
            fromTimestamp: timestamp,
            repeatEvery: {
                daysOfWeek: testDaysOfWeek
            }
        });
        var results = timeEvents.nextAfter(elementsCount, startTimestamp);
        testDaysOfWeek.forEach(function (day) {
            var loopTimestamp = timestamp;
            var d = day - tsDay;
            if (d < 0)
                d += 7;
            loopTimestamp += d * ONE_DAY;
            var _array = Array(elementsCount + 7 * 3).fill(0).map(function () {
                var _timestamp = loopTimestamp;
                loopTimestamp += ONE_WEEK;
                return _timestamp;
            });
            testTimestamps = testTimestamps.concat(_array);
        });
        testTimestamps = uniq(testTimestamps);
        testTimestamps = testTimestamps.filter(function (el) {
            return el > startTimestamp;
        });
        testTimestamps.sort(function (a, b) { return a > b ? 1 : -1; });
        testTimestamps.length = elementsCount;
        chai_1.expect(results).to.be.an('array').that.eql(testTimestamps);
    });
});
