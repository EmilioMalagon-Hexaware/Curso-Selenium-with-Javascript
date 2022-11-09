const arrays = require("../constants/arrays");

class Utils {
  constructor() {}

  getRandomAirport() {
    return arrays.FROM_ARIPORTS[
      Math.floor(Math.random() * arrays.FROM_ARIPORTS.length)
    ];
  }

  getRandomElementFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  getRandomElementFromArrayLimit(array, limit) {
    return array[Math.floor(Math.random() * limit)];
  }
}

module.exports = {
  Utils,
};
