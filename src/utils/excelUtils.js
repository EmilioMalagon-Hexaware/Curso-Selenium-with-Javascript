const XLSX = require("xlsx");

class ExcelUtils {
  constructor() {}

  async readExcelFile(path) {
    const file = XLSX.readFile(path);

    const sheetsNames = file.SheetNames;

    const data = XLSX.utils.sheet_to_json(file.Sheets[sheetsNames[0]]);
  }

  async writeExcelData(path, data) {
    const file = XLSX.readFile(path);
    const sheetsNames = file.SheetNames;

    const ws = XLSX.utils.json_to_sheet(data);

    file.Sheets[sheetsNames[0]] = ws;

    XLSX.writeFile(file, "inputData.xlsx");
  }
}

module.exports = {
  ExcelUtils,
};
