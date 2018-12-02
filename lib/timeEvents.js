"use strict";
// callbacks-helper-tiny - Copyright (C) 2018 Ilya Pavlov
// callbacks-helper-tiny is licensed under the MIT License
Object.defineProperty(exports, "__esModule", { value: true });
;
class TimeEvents {
    constructor() {
        this.tEData = [];
    }
    addTimeEvent(tEObj) {
        let _hasRepeatInterval;
        let repeatInterval;
        if (tEObj.hasOwnProperty('repeatInterval') && undefined !== tEObj.repeatInterval &&
            0 !== tEObj.repeatInterval) {
            repeatInterval = tEObj.repeatInterval;
            if (repeatInterval < 0)
                throw new Error('repeatInterval MUST >= 0');
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
    next(next = 1) {
        const currentTimestamp = new Date().getTime();
        const tEData = this.tEData;
        let nextTSs = [];
        let tEDIndex;
        let tEDLength = tEData.length;
        for (tEDIndex = 0; tEDIndex < tEDLength; tEDIndex++) {
            const timeEvent = tEData[tEDIndex];
            if (false === timeEvent._hasRepeatInterval) {
                if (timeEvent.timestamp > currentTimestamp) {
                    nextTSs.push(timeEvent.timestamp);
                }
            }
            else { // true === timeEvent._hasRepeatInterval
                const repeatInterval = timeEvent.repeatInterval;
                let timestamp;
                if (timeEvent.timestamp > currentTimestamp)
                    timestamp = timeEvent.timestamp;
                else
                    timestamp = timeEvent.timestamp +
                        Math.floor((currentTimestamp - timeEvent.timestamp) / repeatInterval) *
                            repeatInterval + repeatInterval;
                let i;
                for (i = 0; i < next; i++) {
                    nextTSs.push(timestamp);
                    timestamp += repeatInterval;
                }
            }
        }
        // TODO uniq
        nextTSs.sort((a, b) => a > b ? 1 : -1);
        if (nextTSs.length > next)
            nextTSs.length = next;
        return nextTSs;
    }
}
exports.TimeEvents = TimeEvents;
