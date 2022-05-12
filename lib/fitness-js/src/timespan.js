const { padLeft } = require('./utils');

const timeConstants = {
  ms: 1,
  s: 1000,
  min: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
};

class Timespan {
  constructor(value, unit) {
    const v = value || 0;
    const u = unit || 's';

    this.totalMs = v * timeConstants[u];
  }

  addHours(value) {
    this.totalMs += value * timeConstants.h;
    return this;
  }

  addMinutes(value) {
    this.totalMs += value * timeConstants.min;
    return this;
  }

  addSeconds(value) {
    this.totalMs += value * timeConstants.s;
    return this;
  }

  addMilliseconds(value) {
    this.totalMs += value;
    return this;
  }

  getHours() {
    return Math.floor(this.totalMs / timeConstants.h);
  }

  getMinutes() {
    return Math.floor((this.totalMs - this.getHours() * timeConstants.h) / timeConstants.min);
  }

  getSeconds() {
    return Math.floor((this.totalMs - this.getHours() * timeConstants.h
      - this.getMinutes() * timeConstants.min) / timeConstants.s);
  }

  getMilliseconds() {
    return Math.floor(this.totalMs % timeConstants.s);
  }

  toTotalMinutes() {
    return this.totalMs / timeConstants.min;
  }

  toTotalSeconds() {
    return this.totalMs / timeConstants.s;
  }

  toTotalMilliseconds() {
    return this.totalMs;
  }

  toUnit(unit) {
    const u = unit || 'ms';
    return (this.totalMs / timeConstants[u]).toPrecision(4);
  }

  toString() {
    let time = [
      padLeft(this.getHours(), 2),
      padLeft(this.getMinutes(), 2),
      padLeft(this.getSeconds(), 2),
    ].join(':');

    if (this.getMilliseconds() > 0) {
      time += `.${padLeft(this.getMilliseconds(), 3)}`;
    }

    return time;
  }
}

module.exports = Timespan;
