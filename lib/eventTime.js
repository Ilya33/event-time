"use strict";
// event-time - Copyright (C) 2018 Ilya Pavlov
// event-time is licensed under the MIT License
Object.defineProperty(exports, "__esModule", { value: true });
;
const uniq = (a) => {
    let obj = Object.create(null);
    let i;
    let l = a.length;
    for (i = 0; i < l; i++)
        obj[a[i]] = a[i];
    // ES-2017 Object.values
    return Object.keys(obj).map(k => {
        return obj[k];
    });
};
class EventTime {
    constructor() {
        this.ONE_DAY = 86400000;
        this.ONE_WEEK = 604800000;
        this.eTData = [];
    }
    _next(next = 1, startTimestamp = (new Date().getTime())) {
        const eTData = this.eTData;
        let nextTSs = [];
        let eTDIndex;
        let eTDLength = eTData.length;
        for (eTDIndex = 0; eTDIndex < eTDLength; eTDIndex++) {
            const eventTime = eTData[eTDIndex];
            if (false === eventTime._hasRepeatInterval) {
                if (eventTime.timestamp > startTimestamp) {
                    nextTSs.push(eventTime.timestamp);
                }
            }
            else { // true === eventTime._hasRepeatInterval
                const repeatInterval = eventTime.repeatInterval;
                let timestamp;
                if (eventTime.timestamp > startTimestamp)
                    timestamp = eventTime.timestamp;
                else
                    timestamp = eventTime.timestamp +
                        Math.floor((startTimestamp - eventTime.timestamp) / repeatInterval) *
                            repeatInterval + repeatInterval;
                let i;
                for (i = 0; i < next; i++) {
                    nextTSs.push(timestamp);
                    timestamp += repeatInterval;
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
        let _hasRepeatInterval;
        let repeatInterval;
        if (eTObj.hasOwnProperty('repeatInterval') && undefined !== eTObj.repeatInterval &&
            0 !== eTObj.repeatInterval) {
            repeatInterval = eTObj.repeatInterval;
            if (repeatInterval < 0)
                throw new Error('The `repeatInterval` MUST be >= 0');
            _hasRepeatInterval = true;
        }
        else {
            repeatInterval = 0;
            _hasRepeatInterval = false;
        }
        if (eTObj.hasOwnProperty('repeatEvery') && undefined !== eTObj.repeatEvery &&
            0 !== Object.keys(eTObj.repeatEvery).length) {
            if (true == _hasRepeatInterval)
                throw new Error('You may not specify more than one `repeatInterval` or `repeatEvery` option');
            if (1 !== Object.keys(eTObj.repeatEvery).length)
                throw new Error('You may not specify more than one `daysOfWeek` or `daysOfMonth` option (not implemented)');
            const repeatEvery = eTObj.repeatEvery;
            if (repeatEvery.hasOwnProperty('daysOfWeek') && undefined !== repeatEvery.daysOfWeek &&
                0 !== repeatEvery.daysOfWeek.length) {
                const days = uniq(repeatEvery.daysOfWeek);
                let l = days.length;
                let i;
                if (l !== days.filter(el => el === 0 || el === 1 || el === 2 || el === 3 || el === 4 ||
                    el === 5 || el === 6).length)
                    throw new Error('`days` MUST ba an array with days of week numbers 0-6: days since Sunday');
                const tsDay = new Date(eTObj.fromTimestamp).getDay();
                for (i = 0; i < l; i++) {
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
        }
        this.eTData.push({
            _hasRepeatInterval,
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
