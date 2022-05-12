# fitness-js
This project is a collection of utilities for calculation of various fitness metrics.

[![Build Status](https://travis-ci.com/alx17/fitness-js.svg?branch=master)](https://travis-ci.com/alx17/fitness-js)

## Install
```
npm install fitness-js
```

## Pace calculator
The calculator can be used for pace calculation based on time and distance. The function can be also used for calculation of distance or time based on pace.

### Examples
Calculate pace (min/km) needed to run marathon in 5 hours.
```
new Pacer()
  .withLength(Length.MARATHON)
  .withTime(new Timespan(5, 'h'))
  .toPaceUnit('min/km').toString() // 07:06 min/km

new Pacer()
  .withLength(Length.MARATHON)
  .withTime(new Timespan(5, 'h'))
  .toPaceUnit('min/km').toTotalMilliseconds() // 426600 ms
```
Calculate pace (min/mi) needed to run half marathon in 1:50 hours.
```
new Pacer()
  .withLength(Length.HALFMARATHON)
  .withTime(new Timespan().addHours(1).addMinutes(50))
  .toPaceUnit('min/mi').toString('min/mi') // 08:23 min/mi

new Pacer()
  .withLength(Length.HALFMARATHON)
  .withTime(new Timespan().addHours(1).addMinutes(50))
  .toPaceUnit('min/mi').toTotalMilliseconds('min/mi') // 503300 ms
```
Calculate distance that can be ran in 2 hours with pace 5 min/km.
```
new Pacer()
  .withTime(new Timespan(2, 'h'))
  .withPace(new Pace('min/km').addMinutes(5))
  .toLength('km') // 24 km

new Pacer()
  .withTime(new Timespan(2, 'h'))
  .withPace(new Pace('min/km').addMinutes(5))
  .toLength('mi') // ~ 14.9 mi
```
Calculate time needed to run 10 km with pace 4:30 min/km.
```
new Pacer()
  .withLength(new Length(10, 'km'))
  .withPace(new Pace('min/km').addMinutes(4).addSeconds(30))
  .toTime('min') // 45 min
```
Calculate time needed to run 5 mi with pace 8:30 min/mi.
```
new Pacer()
  .withLength(new Length(5, 'mi'))
  .withPace(new Pace('min/mi').addMinutes(8).addSeconds(30))
  .toTimeUnit().toString() // 00:42:30.810

new Pacer()
  .withLength(new Length(5, 'mi'))
  .withPace(new Pace('min/mi').addMinutes(8).addSeconds(30))
  .toTime('s') // 2551 sec
```

More examples can be found in the unit tests.

## Length and distance converter
The converter can be used for lengths convertion among centimeters, meters, kilometers, miles, yards, inches and feet. It also contains constants for marathon and halfmarathon distances.

### Supported units
| Name       | Code |
|------------|------|
| Centimeter | cm   |
| Meter      | m    |
| Kilometer  | km   |
| Mile       | mi   |
| Yard       | yd   |
| Foot       | ft   |
| Inch       | in   |

### Examples
Convert 5 kilometers to miles.
```
new Length(5, 'km').toMiles() // ~ 3.1 miles
```
Convert 5 miles to meters.
```
new Length(5, 'mi').toMeters() // ~ 8046 meters
```
Convert 1 yard to feet.
```
new Length(1, 'yd').toUnit('ft') // 3 ft
```

#### Special constants
| Name         | Length                   |
|--------------|--------------------------|
| MARATHON     | 42.195 km or 26.219 mi   |
| HALFMARATHON | 21.0975 km or 13.1 mi    |

```
Length.MARATHON.toUnit('km') // 42.195 km
Length.MARATHON.toUnit('yd') // 46144.4520 yd
Length.HALFMARATHON.toUnit('mi') // 13.1 mi
```
More examples can be found in the unit tests.

## Running the tests
```
npm test
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.