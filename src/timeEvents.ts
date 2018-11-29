interface TimeEventObject {
    fromTimestamp: number;
}


interface TimeEventsData {
//        _hasRepeatInterval: boolean;
//        _hasAfterTimestamp: boolean;

        timestamp: number;
//        afterTimestamp: number;
//        repeatInterval: number;
};



export class TimeEvents {
    private tEData: TimeEventsData[] = [];

    constructor() {}



    addTimeEvent(tEObj: TimeEventObject) {
        this.tEData.push({
            timestamp: tEObj.fromTimestamp
        });
    }



    next(next: number = 1): number[] {
        const currentTimestamp: number = new Date().getTime();
        const tEData: TimeEventsData[] = this.tEData;
        let nextTSs: number[] = [];
        let tEDIndex: number;
        let tEDLength: number = tEData.length;

        for (tEDIndex=0; tEDIndex<tEDLength; tEDIndex++) {
            const timeEvent: TimeEventsData = tEData[tEDIndex];

            if (timeEvent.timestamp > currentTimestamp) {
                nextTSs.push(timeEvent.timestamp);
            }
        }

        nextTSs.sort((a, b) => a > b ?1 :-1);

        if (nextTSs.length > next)
            nextTSs.length = next;

        return nextTSs;
    }
}