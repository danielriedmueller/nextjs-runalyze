const metricConstants = {
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 1 / 39.37,
  mi: 1609.344,
  yd: (1 / 1.0936).toPrecision(4),
  ft: (1 / 3.281).toPrecision(4),
};

function round(val) {
  return parseFloat(val).toFixed(4);
}

class Length {
  constructor(value, unit) {
    const v = value || 0;
    const u = unit || 'm';

    this.meters = v * metricConstants[u];
  }

  static fromMeters(value) {
    return new Length(value, 'm');
  }

  static fromMiles(value) {
    return new Length(value, 'mi');
  }

  toMeters() {
    return this.toUnit('m');
  }

  toMiles() {
    return this.toUnit('mi');
  }

  toUnit(unit) {
    const u = unit || 'm';

    return round(this.meters / metricConstants[u]);
  }
}

Length.MARATHON = new Length(42.195, 'km');
Length.HALFMARATHON = new Length(21.0975, 'km');

module.exports = Length;
