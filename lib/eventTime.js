"use strict";
// event-time - Copyright (C) 2018-2019 Ilya Pavlov
// event-time is licensed under the MIT License
Object.defineProperty(exports, "__esModule", { value: true });
;
const uniq = (a) => {
    let obj = Object.create(null);
    let i;
    let l = a.length;
    for (i = 0; i < l; ++i)
        obj[a[i]] = a[i];
    // ES-2017 Object.values
    return Object.keys(obj).map(k => {
        return obj[k];
    });
};
class EventTime {
    constructor() {
        this.ONE_SECOND = 1000;
        this.ONE_MINUTE = 60000;
        this.ONE_HOUR = 3600000;
        this.ONE_DAY = 86400000;
        this.ONE_WEEK = 604800000;
        this.RF_NONE = 0;
        this.RF_HAS_REPEAT_INTERVAL = 1;
        this.RF_REPEAT_EVERY_MONTHS = 2;
        this.eTData = [];
    }
    _addMonths(dateObj, months) {
        if (0 === months)
            return dateObj;
        const mDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const allMonths = dateObj.getMonth() + months;
        const needAddYears = Math.floor(allMonths / 12);
        const newMonth = allMonths - needAddYears * 12;
        let dayValue = dateObj.getDate();
        if (dayValue > mDays[newMonth]) {
            if (1 !== newMonth) {
                dayValue = mDays[newMonth];
            }
            else {
                const year = dateObj.getFullYear() + needAddYears;
                // TODO new Date(year, 1, 29).getDate() === 29; http://javascript-benchmark.info/
                if (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0))
                    dayValue = 29;
                else
                    dayValue = 28;
            }
        }
        let d = new Date(dateObj);
        d.setFullYear(dateObj.getFullYear() + needAddYears, newMonth, dayValue);
        return d;
    }
    _next(next = 1, startTimestamp = (new Date().getTime())) {
        const eTData = this.eTData;
        let nextTSs = [];
        let eTDIndex;
        let eTDLength = eTData.length;
        for (eTDIndex = 0; eTDIndex < eTDLength; ++eTDIndex) {
            const eventTime = eTData[eTDIndex];
            if (0 !== (eventTime._repeatFlags & this.RF_HAS_REPEAT_INTERVAL)) {
                const repeatInterval = eventTime.repeatInterval;
                let timestamp = eventTime.timestamp;
                if (timestamp <= startTimestamp)
                    timestamp += Math.floor((startTimestamp - timestamp) / repeatInterval) *
                        repeatInterval + repeatInterval;
                nextTSs.push(timestamp);
                let i;
                for (i = 1; i < next; ++i) {
                    timestamp += repeatInterval;
                    nextTSs.push(timestamp);
                }
            }
            else if (0 !== (eventTime._repeatFlags & this.RF_REPEAT_EVERY_MONTHS)) {
                const monthsInterval = eventTime.repeatInterval;
                let timestamp = eventTime.timestamp;
                let currentInterval = 0;
                if (timestamp <= startTimestamp) {
                    let startTimestampDate = new Date(startTimestamp);
                    let eventTimestampDate = new Date(timestamp);
                    let currentMonthsDelta = (startTimestampDate.getFullYear() - eventTimestampDate.getFullYear()) * 12 -
                        eventTimestampDate.getMonth() + startTimestampDate.getMonth();
                    currentInterval = Math.ceil(currentMonthsDelta / monthsInterval) * monthsInterval;
                    let _timestamp = this._addMonths(new Date(timestamp), currentInterval).getTime();
                    if (_timestamp <= startTimestamp) // tail in few days
                        currentInterval += monthsInterval;
                }
                nextTSs.push(this._addMonths(new Date(timestamp), currentInterval).getTime());
                let i;
                for (i = 1; i < next; ++i) {
                    currentInterval += monthsInterval;
                    nextTSs.push(this._addMonths(new Date(timestamp), currentInterval).getTime());
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
        nextTSs.sort((a, b) => a > b ? 1 : -1);
        if (nextTSs.length > next)
            nextTSs.length = next;
        return nextTSs;
    }
    addEventTime(eTObj) {
        let _repeatFlags = this.RF_NONE;
        let _hasDaysOfMonth = false;
        let repeatInterval = 0;
        if (eTObj.hasOwnProperty('repeatInterval') && undefined !== eTObj.repeatInterval &&
            0 !== eTObj.repeatInterval) {
            repeatInterval = eTObj.repeatInterval;
            if (repeatInterval < 0)
                throw new Error('The `repeatInterval` MUST be >= 0');
            _repeatFlags |= this.RF_HAS_REPEAT_INTERVAL;
        }
        if (eTObj.hasOwnProperty('repeatEvery') && undefined !== eTObj.repeatEvery &&
            0 !== Object.keys(eTObj.repeatEvery).length) {
            if (1 === (_repeatFlags & this.RF_HAS_REPEAT_INTERVAL))
                throw new Error('You may not specify more than one `repeatInterval` or `repeatEvery` option');
            if (1 !== Object.keys(eTObj.repeatEvery).length)
                throw new Error('You may not specify more than one `daysOfWeek` or `months` option (not implemented)');
            const repeatEvery = eTObj.repeatEvery;
            if (repeatEvery.hasOwnProperty('daysOfWeek') && undefined !== repeatEvery.daysOfWeek &&
                0 !== repeatEvery.daysOfWeek.length) {
                const days = uniq(repeatEvery.daysOfWeek);
                let l = days.length;
                let i;
                if (l !== days.filter(el => el === 0 || el === 1 || el === 2 || el === 3 || el === 4 ||
                    el === 5 || el === 6).length)
                    throw new Error('`daysOfWeek` MUST ba an array with days of week numbers 0-6: days since Sunday');
                const tsDay = new Date(eTObj.fromTimestamp).getDay();
                for (i = 0; i < l; ++i) {
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
                0 !== repeatEvery.months) {
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
    nextAfter(next, startTimestamp) {
        return this._next(next, startTimestamp);
    }
    next(next = 1) {
        return this._next(next);
    }
}
exports.EventTime = EventTime;
