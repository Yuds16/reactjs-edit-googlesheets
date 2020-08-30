import React, { Component } from 'react';
// import {GoogleSpreadsheet} from 'google-spreadsheet';

const SHEET_ID = '1CvuBgaAY0DtayM3yy9WAH5MU-dUwyTkx_iHN1ZDZP-8';

const { GoogleSpreadsheet } = require('google-spreadsheet');
const { promisify } = require('util');

const creds = require('./config/service_account_sheets_v2.json');

async function agree(row) {
  try {
    const doc = new GoogleSpreadsheet(SHEET_ID);
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    
    await sheet.loadCells();
    const target = sheet.getCell(row, 3);

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
    await promisify(doc.useServiceAccountAuth)(creds);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    
    await sheet.loadCells();
    const target = sheet.getCell(row, 3);

    target.value = "Disagree";
    await sheet.saveUpdatedCells();
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

  }

  updateAgree = () => {
    agree(parseInt(this.state.value, 10) + 1);
  }

  updateDisagree = () => {
    disagree(parseInt(this.state.value, 10) + 1);
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