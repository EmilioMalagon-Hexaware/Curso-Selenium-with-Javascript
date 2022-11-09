const webdriver = require("selenium-webdriver");
const { By } = require("selenium-webdriver");

class SeleniumUtils {
  constructor() {}
  async searchElement(by, path, driver) {
    switch (by) {
      case "id":
        return await driver.wait(
          webdriver.until.elementLocated(By.id(path)),
          15000
        );
      case "xpath":
        return await driver.wait(
          webdriver.until.elementLocated(By.xpath(path)),
          15000
        );

      case "css":
        return await driver.wait(
          webdriver.until.elementLocated(By.css(path)),
          15000
        );
      default:
        break;
    }
  }

  async searchElements(by, path, driver) {
    switch (by) {
      case "id":
        return await driver.wait(
          webdriver.until.elementsLocated(By.id(path)),
          15000
        );
      case "xpath":
        return await driver.wait(
          webdriver.until.elementsLocated(By.xpath(path)),
          15000
        );
      case "css":
        return await driver.wait(
          webdriver.until.elementsLocated(By.css(path)),
          15000
        );
      default:
        break;
    }
  }
}

module.exports = {
  SeleniumUtils,
};
