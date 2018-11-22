"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TimeEvents {
    constructor() {
        this.tEData = {
            repeats: []
        };
    }
    _setRepeat(rObj) {
        const _hasRepeatInterval = rObj.hasOwnProperty('repeatInterval') ? true : false;
        const _hasAfterTimestamp = rObj.hasOwnProperty('afterTimestamp') ? true : false;
        let afterTimestamp;
        let repeatInterval;
        if (_hasAfterTimestamp) {
            if (undefined === rObj.afterTimestamp)
                throw new Error('The property `afterTimestamp` MUST be a number');
            afterTimestamp = rObj.afterTimestamp;
        }
        else {
            afterTimestamp = 0;
        }
        if (_hasRepeatInterval) {
            if (undefined === rObj.repeatInterval)
                throw new Error('The property `repeatInterval` MUST be a number');
            repeatInterval = rObj.repeatInterval;
        }
        else {
            repeatInterval = 0;
        }
        this.tEData.repeats[0] = {
            _hasRepeatInterval,
            _hasAfterTimestamp,
            fromTimestamp: rObj.fromTimestamp,
            repeatInterval,
            afterTimestamp
        };
    }
    next(n = 1) {
        if (0 === this.tEData.repeats.length)
            return [];
        let nextTSs = [];
        let timestamp = this.tEData.repeats[0].fromTimestamp;
        const interval = this.tEData.repeats[0].repeatInterval;
        let i;
        if (true === this.tEData.repeats[0]._hasAfterTimestamp) {
            // generate only new events
            const afterTimestamp = this.tEData.repeats[0].afterTimestamp > timestamp
                ? this.tEData.repeats[0].afterTimestamp
                : timestamp;
            timestamp += Math.floor((afterTimestamp - timestamp) / interval) * interval;
        }
        for (i = 0; i < n; i++) {
            timestamp += interval;
            nextTSs[i] = timestamp;
        }
        return nextTSs;
    }
}
exports.TimeEvents = TimeEvents;
