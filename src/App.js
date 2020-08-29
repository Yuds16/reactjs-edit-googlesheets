import React, { Component } from 'react';
import './App.css';
import Tabletop from 'tabletop';

const SHEET_ID = '1CvuBgaAY0DtayM3yy9WAH5MU-dUwyTkx_iHN1ZDZP-8';

const { GoogleSpreadsheet } = require('google-spreadsheet');
const { promisify } = require('util');

const creds = require('./config/service_account_sheets.json');

async function agree(row) {
  alert("Checkpoint 1");
  try {
    alert("Checkpoint 2");
    const doc = new GoogleSpreadsheet(SHEET_ID);
    alert("Checkpoint 2.1");
    await promisify(doc.useServiceAccountAuth)(creds);
    alert("Checkpoint 2.2");
    await doc.loadInfo();
    alert("Checkpoint 2.3");
    const sheet = doc.sheetsByIndex[0];
    
    alert("Checkpoint 3");
  
    console.log(sheet.title);
    
    await sheet.loadCells();
    const target = sheet.getCell(row, 3);
    console.log(target.value);

    target.value = "Agree";
    await sheet.saveUpdatedCells();
  } catch (err) {
    console.log(err);
    alert("Failed to complete action, please contact maintainance.");
  }
}

async function disagree(row) {
  try {
    const doc = new GoogleSpreadsheet(SHEET_ID);
    // await promisify(doc.useServiceAccountAuth)(creds);
    // const info = await promisify(doc.getInfo)();
    // const sheet = info.worksheets[0];

    // const cell = await promisify(sheet.getCells)({
    //   'min-row': row,
    //   'max-row': row,
    //   'min-col': 4,
    //   'max-col': 4,
    // });

    // cell[0].value = 'Disagree';
    // cell[0].save();
    // return;
  } catch (err) {
    console.log(err);
    alert("Failed to complete action, please contact maintainance.");
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      value: 1,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  componentDidMount() {
    Tabletop.init({
      key: SHEET_ID,
      callback: googleData => {
        this.setState({
          data: googleData
        })
      },
      simpleSheet: true
    })
  }

  updateAgree = () => {
    agree(parseInt(this.state.value, 10) + 1);
  }

  updateDisagree = async () => {
    await disagree(parseInt(this.state.value, 10) + 1);
  }

  render() {
    return (
      <div>   
        <form>
          <label>
            <input type="number" onChange={this.handleChange} />
          </label>
          <input type="submit" name="buttonAgree" value="Agree" onClick={this.updateAgree} />
          <input type="submit" name="buttonDisagree" value="Disagree" onClick={this.updateDisagree} />
        </form>
      </div>
    );
  }
}

export default App;