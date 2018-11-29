"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
class TimeEvents {
    constructor() {
        this.tEData = [];
    }
    addTimeEvent(tEObj) {
        this.tEData.push({
            timestamp: tEObj.fromTimestamp
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
            if (timeEvent.timestamp > currentTimestamp) {
                nextTSs.push(timeEvent.timestamp);
            }
        }
        nextTSs.sort((a, b) => a > b ? 1 : -1);
        if (nextTSs.length > next)
            nextTSs.length = next;
        return nextTSs;
    }
}
exports.TimeEvents = TimeEvents;
