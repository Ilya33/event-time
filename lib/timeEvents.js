"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TimeEvents {
    constructor() {
        this.tEData = {
            repeats: []
        };
    }
    _setRepeat(rObj) {
        this.tEData.repeats = [rObj];
    }
    next(n = 1) {
        if (0 === this.tEData.repeats.length)
            return [];
        let nextTSs = [];
        let timestamp = this.tEData.repeats[0].fromTimestamp;
        const interval = this.tEData.repeats[0].repeatInterval;
        let i;
        if (this.tEData.repeats[0].hasOwnProperty('afterTimestamp')) { // if af > t
            const _afterTimestamp = this.tEData.repeats[0].afterTimestamp;
            let afterTimestamp;
            if (undefined === _afterTimestamp) {
                throw new Error('The property `afterTimestamp` MUST be a number');
            }
            else {
                // generate only new events
                afterTimestamp = _afterTimestamp > timestamp ? _afterTimestamp : timestamp;
                timestamp += Math.floor((afterTimestamp - timestamp) / interval) * interval;
            }
        }
        for (i = 0; i < n; i++) {
            timestamp += interval;
            nextTSs[i] = timestamp;
        }
        return nextTSs;
    }
}
exports.TimeEvents = TimeEvents;
