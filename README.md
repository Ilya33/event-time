A typescript (javascript) library which helps to calculate future timestamp(s)
for an event.


## Usage

### JavaScript

```js
const TimeEvents = require('time-events').TimeEvents;

const timeEvents = new TimeEvents();

// add single timestamp
timeEvents.addTimeEvent({
    fromTimestamp: new Date().getTime() + 3600000
});

// add timestamp with repeat
timeEvents.addTimeEvent({
    fromTimestamp: 1530000000000,
    repeatInterval: 4000000000
});

// get 8 timestamps after new Date().getTime()
const results0 = timeEvents.next(8);

// get 5 timestamps after 1960000000000
const results1 = timeEvents.nextAfter(5, 1960000000000);
```


### See also

[Later](http://bunkat.github.io/later/)


## License

MIT
