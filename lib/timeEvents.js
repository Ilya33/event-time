"use strict";
// callbacks-helper-tiny - Copyright (C) 2018 Ilya Pavlov
// callbacks-helper-tiny is licensed under the MIT License
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
