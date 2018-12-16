"use strict";
// time-events - Copyright (C) 2018 Ilya Pavlov
// time-events is licensed under the MIT License
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
class TimeEvents {
    constructor() {
        this.ONE_DAY = 86400000;
        this.ONE_WEEK = 604800000;
        this.tEData = [];
    }
    _next(next = 1, startTimestamp = (new Date().getTime())) {
        const tEData = this.tEData;
        let nextTSs = [];
        let tEDIndex;
        let tEDLength = tEData.length;
        for (tEDIndex = 0; tEDIndex < tEDLength; tEDIndex++) {
            const timeEvent = tEData[tEDIndex];
            if (false === timeEvent._hasRepeatInterval) {
                if (timeEvent.timestamp > startTimestamp) {
                    nextTSs.push(timeEvent.timestamp);
                }
            }
            else { // true === timeEvent._hasRepeatInterval
                const repeatInterval = timeEvent.repeatInterval;
                let timestamp;
                if (timeEvent.timestamp > startTimestamp)
                    timestamp = timeEvent.timestamp;
                else
                    timestamp = timeEvent.timestamp +
                        Math.floor((startTimestamp - timeEvent.timestamp) / repeatInterval) *
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
    addTimeEvent(tEObj) {
        let _hasRepeatInterval;
        let repeatInterval;
        if (tEObj.hasOwnProperty('repeatInterval') && undefined !== tEObj.repeatInterval &&
            0 !== tEObj.repeatInterval) {
            repeatInterval = tEObj.repeatInterval;
            if (repeatInterval < 0)
                throw new Error('The `repeatInterval` MUST be >= 0');
            _hasRepeatInterval = true;
        }
        else {
            repeatInterval = 0;
            _hasRepeatInterval = false;
        }
        if (tEObj.hasOwnProperty('repeatEvery') && undefined !== tEObj.repeatEvery &&
            0 !== Object.keys(tEObj.repeatEvery).length) {
            if (true == _hasRepeatInterval)
                throw new Error('You may not specify more than one `repeatInterval` or `repeatEvery` option');
            if (1 !== Object.keys(tEObj.repeatEvery).length)
                throw new Error('You may not specify more than one `daysOfWeek` or `daysOfMonth` option (not implemented)');
            const repeatEvery = tEObj.repeatEvery;
            if (repeatEvery.hasOwnProperty('daysOfWeek') && undefined !== repeatEvery.daysOfWeek &&
                0 !== repeatEvery.daysOfWeek.length) {
                const days = uniq(repeatEvery.daysOfWeek);
                let l = days.length;
                let i;
                if (l !== days.filter(el => el === 0 || el === 1 || el === 2 || el === 3 || el === 4 ||
                    el === 5 || el === 6).length)
                    throw new Error('`days` MUST ba an array with days of week numbers 0-6: days since Sunday');
                const tsDay = new Date(tEObj.fromTimestamp).getDay();
                for (i = 0; i < l; i++) {
                    let d = days[i] - tsDay;
                    if (d < 0)
                        d += 7;
                    this.addTimeEvent({
                        fromTimestamp: tEObj.fromTimestamp + d * this.ONE_DAY,
                        repeatInterval: this.ONE_WEEK
                    });
                }
                return;
            }
        }
        this.tEData.push({
            _hasRepeatInterval,
            timestamp: tEObj.fromTimestamp,
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
exports.TimeEvents = TimeEvents;
