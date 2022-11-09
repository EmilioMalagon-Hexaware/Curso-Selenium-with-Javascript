require("chromedriver");

const { Builder } = require("selenium-webdriver");
const arrays = require("../src/constants/arrays");
const { SeleniumUtils } = require("../src/utils/seleniumUtils");
const { Utils } = require("../src/utils/utils");
const { ExcelUtils } = require("../src/utils/excelUtils");

const path = require("path");
const { elementIsNotSelected } = require("selenium-webdriver/lib/until");
const { fromArray } = require("big-integer");
const chrome = require("selenium-webdriver/chrome");

var driver;
var utils = new Utils();
var seleniumUtils = new SeleniumUtils();
var excelUtils = new ExcelUtils();

async function setUp() {
  driver = await new Builder().forBrowser("chrome").build();
  await driver.manage().setTimeouts({ implicit: 15 });
  await driver.manage().window().maximize();
}

var from;
var to;

async function testOne() {
  await setUp();

  try {
    await driver.get("https://rahulshettyacademy.com/dropdownsPractise/");

    var fromSearchInput = await seleniumUtils.searchElement(
      "id",
      "ctl00_mainContent_ddl_originStation1_CTXT",
      driver
    );

    // while (true) {
    //   from = utils.getRandomAirport();
    //   to = utils.getRandomAirport();
    //   if (from !== to) break;
    // }

    await fromSearchInput.click();

    var fromArrayData = await seleniumUtils.searchElements(
      "xpath",
      "(//div[@class='dropdownDiv'])[1]/ul/li/a",
      driver
    );

    var fromValues = [];

    for (let index = 0; index < fromArrayData.length; index++) {
      const element = await fromArrayData[index].getAttribute("value");
      fromValues.push(element);
    }
    from = utils.getRandomElementFromArray(fromValues);

    await fromSearchInput.sendKeys(from);

    var toSearchInput = await seleniumUtils.searchElement(
      "id",
      "ctl00_mainContent_ddl_destinationStation1_CTXT",
      driver
    );

    await toSearchInput.click();

    var toArrayData = await seleniumUtils.searchElements(
      "xpath",
      "(//div[@class='dropdownDiv'])[3]/ul/li/a",
      driver
    );

    var toValues = [];

    for (let index = 0; index < toArrayData.length; index++) {
      const element = await toArrayData[index].getAttribute("value");
      toValues.push(element);
    }
    to = utils.getRandomElementFromArray(toValues);

    await toSearchInput.sendKeys(to);

    await seleniumUtils
      .searchElement("xpath", "//li[@class='livecl city_selected']/a", driver)
      .then((el) => el.click());

    var data = [];

    fromValues.forEach((from) => {
      var obj = {
        DT_URL: "",
        DT_DEPARTURE: from,
        DT_ARRIVAL: "",
      };
      data.push(obj);
    });

    var index = 0;
    toValues.forEach((to) => {
      data[index]["DT_ARRIVAL"] = to;
      index++;
    });

    await excelUtils.writeExcelData("inputData.xlsx", data);

    const nowDate = new Date();

    var departDate = new Date(nowDate.setDate(nowDate.getDate() + 5)).getDate();

    var xpathToDay =
      departDate < new Date().getDate()
        ? `(//td/a[text()='${departDate}'])[2]`
        : `(//td/a[text()='${departDate}'])[1]`;

    await seleniumUtils
      .searchElement("xpath", xpathToDay, driver)
      .then((el) => el.click());

    await seleniumUtils
      .searchElement("id", "divpaxinfo", driver)
      .then((el) => el.click());

    await new Promise((r) => setTimeout(r, 1000));

    var plusButton = await seleniumUtils.searchElement(
      "xpath",
      "//div[@id='divpaxOptions']/div[@id='divAdult']/div[2]/span[@id='hrefIncAdt']",
      driver
    );

    for (let index = 0; index < 2; index++) {
      await plusButton.click();
    }

    await seleniumUtils
      .searchElement("id", "btnclosepaxoption", driver)
      .then((el) => el.click());
    await seleniumUtils
      .searchElement("id", "ctl00_mainContent_btn_FindFlights", driver)
      .then((el) => el.click());
  } catch (error) {
    console.log(error);
    throw new Error(error);
  } finally {
    await driver.quit();
  }
}

async function testTwo() {
  await setUp();

  try {
    await driver.get("https://flights.volaris.com/es-mx/");

    var fromSearchInput = await seleniumUtils.searchElement(
      "id",
      "em__b-UID__booking-origin-selector-container",
      driver
    );

    let actions = driver.actions({ async: true });

    await actions.move({ origin: fromSearchInput }).perform();

    var cookiesAcceptButton = await seleniumUtils.searchElement(
      "xpath",
      "//button[text()='Aceptar']",
      driver
    );

    cookiesAcceptButton.click();

    fromSearchInput.click();

    await new Promise((r) => setTimeout(r, 2000));

    var fromArrayData = await seleniumUtils.searchElements(
      "xpath",
      "(//div[@class='em__autocomplete__menu-list']/div/div/div)",
      driver
    );

    var fromValues = [];

    for (let index = 0; index < fromArrayData.length; index++) {
      const element = await fromArrayData[index].getAttribute("aria-label");
      fromValues.push(element);
    }
    console.log(fromValues);
    from = utils.getRandomElementFromArrayLimit(fromValues, 11);

    var fromSelectValue = await seleniumUtils.searchElement(
      "xpath",
      `//div[@class='em__autocomplete__menu-list']/div/div/div[@aria-label='${from}']`,
      driver
    );

    await fromSelectValue.click();

    await new Promise((r) => setTimeout(r, 2000));

    var toSearchInput = await seleniumUtils.searchElement(
      "id",
      "em__b-UID__booking-destination-selector-container",
      driver
    );

    toSearchInput.click();

    await new Promise((r) => setTimeout(r, 1000));

    var toArrayData = await seleniumUtils.searchElements(
      "xpath",
      "(//div[@class='em__autocomplete__menu-list']/div/div/div)",
      driver
    );

    var toValues = [];

    for (let index = 0; index < toArrayData.length; index++) {
      const element = await toArrayData[index].getAttribute("aria-label");
      toValues.push(element);
    }

    console.log(toValues);
    to = utils.getRandomElementFromArray(toValues);

    var toSelectValue = await seleniumUtils.searchElement(
      "xpath",
      `//div[@class='em__autocomplete__menu-list']/div/div/div[@aria-label='${to}']`,
      driver
    );

    await toSelectValue.click();

    var data = [];

    fromValues.forEach((from) => {
      var obj = {
        DT_URL: "",
        DT_DEPARTURE: from,
        DT_ARRIVAL: "",
      };
      data.push(obj);
    });

    var index = 0;
    toValues.forEach((to) => {
      data[index]["DT_ARRIVAL"] = to;
      index++;
    });

    await excelUtils.writeExcelData("inputData.xlsx", data);

    await seleniumUtils
      .searchElement("id", "em__b-UID__booking-departure", driver)
      .then((el) => {
        el.click();
      });

    const nowDate = new Date();

    var departDate = new Date(
      nowDate.setDate(nowDate.getDate() + 10)
    ).getDate();

    var xpathToDay =
      departDate < new Date().getDate()
        ? `(//div[(@class='DayPicker-Day' or @class='DayPicker-Day DayPicker-Day--selected') and text()='${departDate}'])[2]`
        : `(//div[(@class='DayPicker-Day' or @class='DayPicker-Day DayPicker-Day--selected') and text()='${departDate}'])[1]`;

    await seleniumUtils
      .searchElement("xpath", xpathToDay, driver)
      .then((el) => el.click());

    //Return datte
    var returnDate = new Date(nowDate.setDate(nowDate.getDate() + 4)).getDate();

    var xpathToDayReturn =
      returnDate < departDate
        ? `(//div[(@class='DayPicker-Day' or @class='DayPicker-Day DayPicker-Day--selected') and text()='${returnDate}'])[2]`
        : `(//div[(@class='DayPicker-Day' or @class='DayPicker-Day DayPicker-Day--selected') and text()='${returnDate}'])[1]`;

    await seleniumUtils
      .searchElement("xpath", xpathToDayReturn, driver)
      .then((el) => el.click());

    //Pasajeros

    await seleniumUtils
      .searchElement("id", "em__b-UID__booking-travelers", driver)
      .then((el) => el.click());

    await new Promise((r) => setTimeout(r, 1000));

    var plusButton = await seleniumUtils.searchElement(
      "xpath",
      "(//button[@class='TravelerSelector__poperIncrement'])[1]",
      driver
    );

    for (let index = 0; index < 2; index++) {
      await plusButton.click();
    }

    await seleniumUtils
      .searchElement("xpath", "//button[@class='Booking_submitButton']", driver)
      .then((el) => el.click());

    await new Promise((r) => setTimeout(r, 20000));

    var fromLabelWe = await seleniumUtils.searchElement(
      "xpath",
      "//span[@class='departure']",
      driver
    );

    var toLabelWe = await seleniumUtils.searchElement(
      "xpath",
      "//span[@class='arrival']",
      driver
    );

    var fromLabel = await fromLabelWe.getText();
    var toLabel = await toLabelWe.getText();

    console.assert(
      from === fromLabel,
      `The from label ${from} is not equal to ${fromLabel}`
    );
    console.assert(
      to === toLabel,
      `The to label ${to} is not equal to ${toLabel}`
    );

    console.log(`The from label ${from} is equal to ${fromLabel}`);
    console.log(`The to label ${to} is equal to ${toLabel}`);

    //Check if need to re search

    try {
      var searchAgain = await seleniumUtils.searchElement(
        "xpath",
        "//span[text()='Busca de nuevo']",
        driver
      );
      if (searchAgain) {
        driver.quit();
        testTwo();
      }
    } catch (error) {
      console.log(error);
    }

    //Selecting low cost

    var pricesArryData = await seleniumUtils.searchElements(
      "xpath",
      "//span[@class='pricebox']/span[@class='price ng-star-inserted']",
      driver
    );

    var priceValues = [];

    for (let index = 0; index < pricesArryData.length; index++) {
      const element = await pricesArryData[index].getText();
      var price = element.split(" ")[0];
      price = Number(price.replace(/[^0-9.-]+/g, ""));
      priceValues.push(price);
    }

    var lowCost = Math.min(...priceValues);

    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    var lowPriceElement = await seleniumUtils.searchElement(
      "xpath",
      `//span[@class='pricebox']/span[@class='price ng-star-inserted' and contains(text(), '${formatter.format(
        lowCost
      )}')]`,
      driver
    );

    await lowPriceElement.click();

    console.log("lowCost ", formatter.format(lowCost));

    for (let index = 0; index < 2; index++) {
      await new Promise((r) => setTimeout(r, 2000));

      await seleniumUtils
        .searchElement(
          "xpath",
          "(//a[@class='panel-open ng-star-inserted'])[1]",
          driver
        )
        .then((el) => el.click());

      var classiCard = await seleniumUtils.searchElement(
        "xpath",
        "//mat-card[@class='classic mat-card ng-star-inserted']",
        driver
      );

      actions = driver.actions({ async: true });

      await actions.move({ origin: classiCard }).perform();

      await new Promise((r) => setTimeout(r, 2000));

      await seleniumUtils
        .searchElement(
          "xpath",
          "(//button/span[@class='mat-button-wrapper' and text()='Seleccionar'])[2]",
          driver
        )
        .then((el) => el.click());
    }

    await seleniumUtils
      .searchElement("id", "mat-checkbox-1", driver)
      .then((el) => el.click());

    await seleniumUtils
      .searchElement(
        "xpath",
        "(//button/span[@class='mat-button-wrapper' and text()=' Continuar a asientos '])[1]",
        driver
      )
      .then((el) => el.click());
  } catch (error) {
    console.log(error);
    throw new Error(error);
  } finally {
    // await driver.quit();
  }
}

// testOne();
testTwo();
