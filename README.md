# event-time


A typescript (javascript) library which helps to calculate future timestamps
for an event.


## Install

```
npm install event-time
```


## Usage

### JavaScript

```js
const EventTime = require('event-time').EventTime;

const eventTime = new EventTime();


// add single timestamp
eventTime.addEventTime({
    fromTimestamp: new Date().getTime() + 3600000
});

// add timestamp with repeat
eventTime.addEventTime({
    fromTimestamp: 1530000000000,
    repeatInterval: 4000000000
});

// add repeat every Sunday (0), Monday (1), Wednesday (3) and Saturday (6)
// after 1530000000000 at timestamp's time
eventTime.addEventTime({
    fromTimestamp: 1530000000000,
    repeatEvery: {
        daysOfWeek: [0, 1, 3, 6]
    }
});


// get 8 timestamps after new Date().getTime()
const results0 = eventTime.next(8);

// get 5 timestamps after 2560000000000
const results1 = eventTime.nextAfter(5, 2560000000000);
```


### See also

[Later](https://github.com/bunkat/later)


## License

MIT