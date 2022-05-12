const { padLeft } = require('./utils');
const Timespan = require('./timespan');

const timeConstants = {
  'min/km': 1,
  'min/mi': 1.609,
};

class Pace {
  constructor(unit) {
    this.timespan = new Timespan();
    this.paceUnit = unit || 'min/km';
  }

  addMinutes(value) {
    this.timespan.addMinutes(value);
    return this;
  }

  addSeconds(value) {
    this.timespan.addSeconds(value);
    return this;
  }

  addMilliseconds(value) {
    this.timespan.addMilliseconds(value);
    return this;
  }

  toTotalMilliseconds(unit) {
    const u = unit || 'min/km';

    let k = 1;
    if (u !== this.paceUnit) {
      if (u === 'min/km') {
        k = 1 / timeConstants['min/mi'];
      } else {
        k = timeConstants['min/mi'];
      }
    }

    return (this.timespan.toTotalMilliseconds(u) * k).toPrecision(4);
  }

  toString(unit) {
    const time = new Timespan(this.toTotalMilliseconds(unit), 'ms');

    return [
      padLeft(time.getHours() * 60 + time.getMinutes(), 2),
      padLeft(time.getSeconds(), 2),
    ].join(':');
  }
}

module.exports = Pace;
