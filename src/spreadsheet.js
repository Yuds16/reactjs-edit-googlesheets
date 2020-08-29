const {GoogleSpreadsheet} = require('google-spreadsheet');
const {promisify} = require('util');

const creds = require('./config/service_account_sheets.json');
const SHEET_ID = '1CvuBgaAY0DtayM3yy9WAH5MU-dUwyTkx_iHN1ZDZP-8';
const doc = new GoogleSpreadsheet(SHEET_ID);

async function agree(row) {
  // alert("Checkpoint 1");
  try {
    // alert("Checkpoint 2");
    const doc = new GoogleSpreadsheet(SHEET_ID);
    // alert("Checkpoint 2.1");
    await doc.useServiceAccountAuth(creds);
    // alert("Checkpoint 2.2");
    await doc.loadInfo();
    // alert("Checkpoint 2.3");
    const sheet = doc.sheetsByIndex[0];

    // alert("Checkpoint 3");
    console.log(sheet.title);


    await sheet.loadCells();
    const target = sheet.getCell(row, 3);
    console.log(target.value);

    target.value = "Disagree";
    await sheet.saveUpdatedCells();
  } catch (err) {
    console.log(err);
  }
}

agree(5);