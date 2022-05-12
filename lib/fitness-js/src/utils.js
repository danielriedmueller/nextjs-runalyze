function padLeft(value, size) {
  return Array(Math.max(size - String(value).length + 1, 0)).join(0) + value;
}

module.exports = {
  padLeft,
};
