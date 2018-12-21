"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai"); // add chai date?
var eventTime_1 = require("../lib/eventTime");
describe('EventTime', function () {
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
    it('empty EventTime, next()', function () {
        var eventTime = new eventTime_1.EventTime();
        var r = eventTime.next();
        chai_1.expect(r).to.be.an('array').that.is.empty;
    });
    it('empty EventTime, next(16)', function () {
        var eventTime = new eventTime_1.EventTime();
        var r = eventTime.next(16);
        chai_1.expect(r).to.be.an('array').that.is.empty;
    });
    it('fromTimestamp, next()', function () {
        var timestamp = new Date().getTime() + ONE_WEEK;
        var testTimestamp = timestamp;
        var eventTime = new eventTime_1.EventTime();
        var i;
        for (i = 0; i < 8; i++) {
            eventTime.addEventTime({
                fromTimestamp: timestamp
            });
            timestamp += ONE_HOUR;
        }
        var r = eventTime.next();
        chai_1.expect(r).to.be.an('array').that.eql([testTimestamp]);
    });
    it('fromTimestamp, next(16), add 7', function () {
        var timestamp = new Date().getTime() + ONE_WEEK;
        var eventTime = new eventTime_1.EventTime();
        var testTimestamps = [];
        var i;
        for (i = 0; i < 7; i++) {
            eventTime.addEventTime({
                fromTimestamp: timestamp
            });
            testTimestamps.push(timestamp);
            timestamp += ONE_HOUR;
        }
        var r = eventTime.next(16);
        chai_1.expect(r).to.be.an('array').that.eql(testTimestamps);
    });
    it('fromTimestamp, next(16), add 19', function () {
        var timestamp = new Date().getTime() + ONE_WEEK;
        var eventTime = new eventTime_1.EventTime();
        var elementsCount = 16;
        var testTimestamps = [];
        var i;
        for (i = 0; i < 19; i++) {
            eventTime.addEventTime({
                fromTimestamp: timestamp
            });
            testTimestamps.push(timestamp);
            timestamp += ONE_HOUR;
        }
        testTimestamps.length = elementsCount;
        var r = eventTime.next(elementsCount);
        chai_1.expect(r).to.be.an('array').that.eql(testTimestamps);
    });
    it('fromTimestamp, next(16), unique', function () {
        var timestamp = new Date().getTime() + ONE_WEEK;
        var eventTime = new eventTime_1.EventTime();
        var elementsCount = 16;
        var testTimestamps = [
            timestamp,
            timestamp + 1024,
            timestamp + 2048,
        ];
        var i;
        for (i = 0; i < 8; i++) {
            eventTime.addEventTime({
                fromTimestamp: testTimestamps[0]
            });
            eventTime.addEventTime({
                fromTimestamp: testTimestamps[1]
            });
            eventTime.addEventTime({
                fromTimestamp: testTimestamps[2]
            });
        }
        var r = eventTime.next(elementsCount);
        chai_1.expect(r).to.be.an('array').that.eql(testTimestamps);
    });
    it('fromTimestamp, next(16), add 16, 3 in the past', function () {
        var timestamp = new Date().getTime() - 2.5 * ONE_HOUR;
        var eventTime = new eventTime_1.EventTime();
        var elementsCount = 16;
        var testTimestamps = [];
        var i;
        for (i = 0; i < 16; i++) {
            eventTime.addEventTime({
                fromTimestamp: timestamp
            });
            testTimestamps.push(timestamp);
            timestamp += ONE_HOUR;
        }
        testTimestamps.shift();
        testTimestamps.shift();
        testTimestamps.shift();
        var r = eventTime.next(elementsCount);
        chai_1.expect(r).to.be.an('array').that.eql(testTimestamps);
    });
    it('fromTimestamp (single), repeatInterval = 0, next(16)', function () {
        var timestamp = new Date().getTime() + ONE_WEEK;
        var interval = 0;
        var eventTime = new eventTime_1.EventTime();
        var elementsCount = 16;
        eventTime.addEventTime({
            fromTimestamp: timestamp,
            repeatInterval: interval
        });
        var r = eventTime.next(elementsCount);
        chai_1.expect(r).to.be.an('array').that.eql([timestamp]);
    });
    it('fromTimestamp (single), repeatInterval = -5 (error)', function () {
        var eventTime = new eventTime_1.EventTime();
        var hasError = false;
        try {
            eventTime.addEventTime({
                fromTimestamp: 123456,
                repeatInterval: -5
            });
        }
        catch (e) {
            hasError = true;
        }
        chai_1.expect(hasError).eql(true);
    });
    // TODO repeatInterval is float
    it('fromTimestamp (single), repeatInterval, next(16)', function () {
        var timestamp = new Date().getTime() + ONE_WEEK;
        var interval = ONE_HOUR;
        var eventTime = new eventTime_1.EventTime();
        var elementsCount = 16;
        eventTime.addEventTime({
            fromTimestamp: timestamp,
            repeatInterval: interval
        });
        var r = eventTime.next(elementsCount);
        chai_1.expect(r).to.be.an('array').that.eql(Array(elementsCount).fill(0).map(function () {
            var _timestamp = timestamp;
            timestamp += interval;
            return _timestamp;
        }));
    });
    it('fromTimestamp (single), repeatInterval, next(16), 3 in the past', function () {
        var timestamp = new Date().getTime() - 25 * ONE_HOUR;
        var interval = 10 * ONE_HOUR;
        var eventTime = new eventTime_1.EventTime();
        var elementsCount = 16;
        eventTime.addEventTime({
            fromTimestamp: timestamp,
            repeatInterval: interval
        });
        var r = eventTime.next(elementsCount);
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
        var eventTime = new eventTime_1.EventTime();
        var elementsCount = 16;
        var testTimestamps = [];
        eventTime.addEventTime({
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
        eventTime.addEventTime({
            fromTimestamp: anotherTimestamp,
            repeatInterval: interval
        });
        var r = eventTime.next(elementsCount);
        chai_1.expect(r).to.be.an('array').that.eql(testTimestamps);
    });
    it('fromTimestamp, repeatInterval, next(16)', function () {
        var timestamp = new Date().getTime() + ONE_WEEK;
        var interval = ONE_HOUR;
        var eventTime = new eventTime_1.EventTime();
        var elementsCount = 16;
        var testTimestamps = [];
        var i;
        eventTime.addEventTime({
            fromTimestamp: 123456
        });
        for (i = 0; i < 5; i++) {
            eventTime.addEventTime({
                fromTimestamp: timestamp
            });
            testTimestamps.push(timestamp);
            timestamp += interval;
        }
        var _loop_1 = function () {
            eventTime.addEventTime({
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
        var r = eventTime.next(elementsCount);
        chai_1.expect(r).to.be.an('array').that.eql(testTimestamps);
    });
    it('fromTimestamp, repeatInterval, nextAfter(16)', function () {
        var timestamp = new Date().getTime() + ONE_WEEK;
        var interval = 2 * ONE_HOUR;
        var eventTime = new eventTime_1.EventTime();
        var elementsCount = 16;
        var startTimestamp = timestamp + ONE_HOUR;
        var addEventTimesCount = 2;
        var testTimestamps = [];
        var i;
        eventTime.addEventTime({
            fromTimestamp: 123456
        });
        var _loop_2 = function () {
            eventTime.addEventTime({
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
        for (i = 0; i < addEventTimesCount; i++) {
            _loop_2();
        }
        var results = eventTime.nextAfter(elementsCount, startTimestamp);
        testTimestamps = uniq(testTimestamps);
        testTimestamps = testTimestamps.filter(function (el) {
            return el > startTimestamp;
        });
        testTimestamps.sort(function (a, b) { return a > b ? 1 : -1; });
        testTimestamps.length = elementsCount;
        chai_1.expect(results).to.be.an('array').that.eql(testTimestamps);
    });
    it('fromTimestamp, repeatInterval and repeatEvery (error)', function () {
        var eventTime = new eventTime_1.EventTime();
        var hasError = false;
        try {
            eventTime.addEventTime({
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
    it('fromTimestamp, repeatEvery daysOfWeek and months (not implemented)', function () {
        var eventTime = new eventTime_1.EventTime();
        var hasError = false;
        try {
            eventTime.addEventTime({
                fromTimestamp: 123456,
                repeatEvery: {
                    daysOfWeek: [0],
                    months: 11
                }
            });
        }
        catch (e) {
            hasError = true;
        }
        chai_1.expect(hasError).eql(true);
    });
    it('fromTimestamp, repeatEvery daysOfWeek (error)', function () {
        var eventTime = new eventTime_1.EventTime();
        var hasError = false;
        try {
            eventTime.addEventTime({
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
        var eventTime = new eventTime_1.EventTime();
        var hasError = false;
        try {
            eventTime.addEventTime({
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
        var eventTime = new eventTime_1.EventTime();
        var elementsCount = 16;
        var testTimestamps = [];
        eventTime.addEventTime({
            fromTimestamp: timestamp,
            repeatEvery: {
                daysOfWeek: [tsDay]
            }
        });
        var results = eventTime.next(elementsCount);
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
        var eventTime = new eventTime_1.EventTime();
        var elementsCount = 16;
        var testTimestamps = [];
        var currentTimestamp = new Date().getTime();
        if (currentTimestamp > timestamp)
            timestamp += Math.floor((currentTimestamp - timestamp) / ONE_WEEK) * ONE_WEEK;
        timestamp += 2 * ONE_WEEK;
        eventTime.addEventTime({
            fromTimestamp: timestamp,
            repeatEvery: {
                daysOfWeek: [4]
            }
        });
        var results = eventTime.next(elementsCount);
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
        var eventTime = new eventTime_1.EventTime();
        var elementsCount = 16;
        var testTimestamps = [];
        var currentTimestamp = new Date().getTime();
        if (currentTimestamp > timestamp)
            timestamp += Math.floor((currentTimestamp - timestamp) / ONE_WEEK) * ONE_WEEK;
        timestamp += 2 * ONE_WEEK;
        eventTime.addEventTime({
            fromTimestamp: timestamp,
            repeatEvery: {
                daysOfWeek: [3]
            }
        });
        var results = eventTime.next(elementsCount);
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
        var eventTime = new eventTime_1.EventTime();
        var elementsCount = 16;
        var testTimestamps = [];
        var testDaysOfWeek = [1, 3, 6];
        var currentTimestamp = new Date().getTime();
        if (currentTimestamp > timestamp)
            timestamp += Math.floor((currentTimestamp - timestamp) / ONE_WEEK) * ONE_WEEK;
        timestamp += 2 * ONE_WEEK;
        eventTime.addEventTime({
            fromTimestamp: timestamp,
            repeatEvery: {
                daysOfWeek: testDaysOfWeek
            }
        });
        var results = eventTime.next(elementsCount);
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
        var eventTime = new eventTime_1.EventTime();
        var elementsCount = 16;
        var testTimestamps = [];
        var testDaysOfWeek = [1, 2, 5];
        eventTime.addEventTime({
            fromTimestamp: timestamp,
            repeatEvery: {
                daysOfWeek: testDaysOfWeek
            }
        });
        var results = eventTime.next(elementsCount);
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
        var eventTime = new eventTime_1.EventTime();
        var elementsCount = 16;
        var testTimestamps = [];
        var testDaysOfWeek = [1, 2, 5];
        eventTime.addEventTime({
            fromTimestamp: timestamp,
            repeatEvery: {
                daysOfWeek: testDaysOfWeek
            }
        });
        var startTimestamp = new Date().getTime() + ONE_DAY;
        var results = eventTime.nextAfter(elementsCount, startTimestamp);
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
        var eventTime = new eventTime_1.EventTime();
        var elementsCount = 16;
        var testTimestamps = [];
        var testDaysOfWeek = [1, 2, 5];
        var currentTimestamp = new Date().getTime();
        eventTime.addEventTime({
            fromTimestamp: currentTimestamp + 4 * ONE_HOUR,
        });
        testTimestamps = [currentTimestamp + 4 * ONE_HOUR];
        var loopTimestamp = currentTimestamp - ONE_HOUR;
        var loopRepeatInterval = 2 * ONE_HOUR;
        eventTime.addEventTime({
            fromTimestamp: loopTimestamp,
            repeatInterval: loopRepeatInterval
        });
        var _array = Array(elementsCount + 7 * 3).fill(0).map(function () {
            var _timestamp = loopTimestamp;
            loopTimestamp += loopRepeatInterval;
            return _timestamp;
        });
        testTimestamps = testTimestamps.concat(_array);
        eventTime.addEventTime({
            fromTimestamp: timestamp,
            repeatEvery: {
                daysOfWeek: testDaysOfWeek
            }
        });
        var results = eventTime.next(elementsCount);
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
        var eventTime = new eventTime_1.EventTime();
        var elementsCount = 16;
        var testTimestamps = [];
        var testDaysOfWeek = [2, 3];
        var startTimestamp = new Date().getTime() + 2 * ONE_HOUR;
        eventTime.addEventTime({
            fromTimestamp: startTimestamp + 4 * ONE_HOUR,
        });
        testTimestamps = [startTimestamp + 4 * ONE_HOUR];
        var loopTimestamp = startTimestamp - ONE_HOUR;
        var loopRepeatInterval = 2 * ONE_HOUR;
        eventTime.addEventTime({
            fromTimestamp: loopTimestamp,
            repeatInterval: loopRepeatInterval
        });
        var _array = Array(elementsCount + 7 * 3).fill(0).map(function () {
            var _timestamp = loopTimestamp;
            loopTimestamp += loopRepeatInterval;
            return _timestamp;
        });
        testTimestamps = testTimestamps.concat(_array);
        eventTime.addEventTime({
            fromTimestamp: timestamp,
            repeatEvery: {
                daysOfWeek: testDaysOfWeek
            }
        });
        var results = eventTime.nextAfter(elementsCount, startTimestamp);
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
    it('dirty private _addMonths test', function () {
        var eventTime = new eventTime_1.EventTime();
        var dirtyPrivateMethod = eventTime['_addMonths'];
        var date0 = new Date(2018, 0, 1);
        var date0Timestamp = date0.getTime();
        var expectedDates0 = [
            new Date(2018, 0, 1),
            new Date(2018, 1, 1),
            new Date(2018, 2, 1),
            new Date(2018, 3, 1),
            new Date(2018, 4, 1),
            new Date(2018, 5, 1),
            new Date(2018, 11, 1),
            new Date(2019, 0, 1),
            new Date(2019, 1, 1),
            new Date(2020, 2, 1),
            new Date(2021, 3, 1),
            new Date(2022, 4, 1),
            new Date(2023, 5, 1),
        ];
        var results0 = [];
        results0.push(dirtyPrivateMethod(new Date(date0Timestamp), 0));
        results0.push(dirtyPrivateMethod(new Date(date0Timestamp), 1));
        results0.push(dirtyPrivateMethod(new Date(date0Timestamp), 2));
        results0.push(dirtyPrivateMethod(new Date(date0Timestamp), 3));
        results0.push(dirtyPrivateMethod(new Date(date0Timestamp), 4));
        results0.push(dirtyPrivateMethod(new Date(date0Timestamp), 5));
        results0.push(dirtyPrivateMethod(new Date(date0Timestamp), 11));
        results0.push(dirtyPrivateMethod(new Date(date0Timestamp), 12));
        results0.push(dirtyPrivateMethod(new Date(date0Timestamp), 13));
        results0.push(dirtyPrivateMethod(new Date(date0Timestamp), 26));
        results0.push(dirtyPrivateMethod(new Date(date0Timestamp), 39));
        results0.push(dirtyPrivateMethod(new Date(date0Timestamp), 52));
        results0.push(dirtyPrivateMethod(new Date(date0Timestamp), 65));
        var date1 = new Date(2018, 0, 31);
        var date1Timestamp = date1.getTime();
        var expectedDates1 = [
            new Date(2018, 0, 31),
            new Date(2018, 1, 28),
            new Date(2018, 2, 31),
            new Date(2018, 3, 30),
            new Date(2019, 1, 28),
            new Date(2019, 2, 31),
            new Date(2019, 3, 30),
            new Date(2020, 1, 29),
            new Date(2021, 1, 28),
            new Date(2021, 2, 31),
        ];
        var results1 = [];
        results1.push(dirtyPrivateMethod(new Date(date1Timestamp), 0));
        results1.push(dirtyPrivateMethod(new Date(date1Timestamp), 1));
        results1.push(dirtyPrivateMethod(new Date(date1Timestamp), 2));
        results1.push(dirtyPrivateMethod(new Date(date1Timestamp), 3));
        results1.push(dirtyPrivateMethod(new Date(date1Timestamp), 13));
        results1.push(dirtyPrivateMethod(new Date(date1Timestamp), 14));
        results1.push(dirtyPrivateMethod(new Date(date1Timestamp), 15));
        results1.push(dirtyPrivateMethod(new Date(date1Timestamp), 25));
        results1.push(dirtyPrivateMethod(new Date(date1Timestamp), 37));
        results1.push(dirtyPrivateMethod(new Date(date1Timestamp), 38));
        var date2 = new Date(2018, 3, 30);
        var date2Timestamp = date2.getTime();
        var expectedDates2 = [
            new Date(2018, 3, 30),
            new Date(2018, 4, 30),
            new Date(2018, 5, 30),
            new Date(2018, 6, 30),
            new Date(2019, 1, 28),
            new Date(2019, 2, 30),
            new Date(2019, 3, 30),
            new Date(2020, 1, 29),
            new Date(2021, 1, 28),
            new Date(2021, 2, 30),
        ];
        var results2 = [];
        results2.push(dirtyPrivateMethod(new Date(date2Timestamp), 0));
        results2.push(dirtyPrivateMethod(new Date(date2Timestamp), 1));
        results2.push(dirtyPrivateMethod(new Date(date2Timestamp), 2));
        results2.push(dirtyPrivateMethod(new Date(date2Timestamp), 3));
        results2.push(dirtyPrivateMethod(new Date(date2Timestamp), 10));
        results2.push(dirtyPrivateMethod(new Date(date2Timestamp), 11));
        results2.push(dirtyPrivateMethod(new Date(date2Timestamp), 12));
        results2.push(dirtyPrivateMethod(new Date(date2Timestamp), 22));
        results2.push(dirtyPrivateMethod(new Date(date2Timestamp), 34));
        results2.push(dirtyPrivateMethod(new Date(date2Timestamp), 35));
        chai_1.expect(results0.map(function (el) { return el.getTime(); })).eql(expectedDates0.map(function (el) { return el.getTime(); }));
        chai_1.expect(results1.map(function (el) { return el.getTime(); })).eql(expectedDates1.map(function (el) { return el.getTime(); }));
        chai_1.expect(results2.map(function (el) { return el.getTime(); })).eql(expectedDates2.map(function (el) { return el.getTime(); }));
    });
    it('fromTimestamp, repeatEvery months = 0, next(16)', function () {
        var timestamp = new Date().getTime() + ONE_WEEK;
        var eventTime = new eventTime_1.EventTime();
        var elementsCount = 16;
        eventTime.addEventTime({
            fromTimestamp: timestamp,
            repeatEvery: {
                months: 0
            }
        });
        var results = eventTime.next(elementsCount);
        chai_1.expect(results).to.be.an('array').that.eql([timestamp]);
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
