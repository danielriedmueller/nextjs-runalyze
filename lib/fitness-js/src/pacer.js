const Length = require('./length');
const Timespan = require('./timespan');
const Pace = require('./pace');

class Pacer {
  withTime(value) {
    this.time = value instanceof Timespan ? value : new Timespan(value, 'ms');
    return this;
  }

  withLength(value, unit) {
    this.length = value instanceof Length ? value : new Length(value, unit);
    return this;
  }

  withPace(value, seconds, unit) {
    this.pace = value instanceof Pace ? value : new Pace(unit)
      .addMinutes(value)
      .addSeconds(seconds);
    return this;
  }

  toTime(unit) {
    return new Timespan((this.length.toMeters() * this.pace.toTotalMilliseconds()) / 1000, 'ms').toUnit(unit);
  }

  toTimeUnit() {
    return new Timespan((this.length.toMeters() * this.pace.toTotalMilliseconds()) / 1000, 'ms');
  }

  toLength(unit) {
    return new Length((this.time.toTotalMilliseconds() / this.pace.toTotalMilliseconds()) * 1000, 'm').toUnit(unit);
  }

  toPace(unit) {
    return new Pace(unit)
      .addMilliseconds((this.time.toTotalMilliseconds() / this.length.toMeters()) * 1000)
      .toTotalMilliseconds();
  }

  toPaceUnit(unit) {
    return new Pace('min/km').addMilliseconds((this.time.toTotalMilliseconds(unit) / this.length.toMeters()) * 1000);
  }
}

module.exports = Pacer;
