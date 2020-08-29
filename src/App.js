import React, { Component } from 'react';
import './App.css';
import Tabletop from 'tabletop';

const SHEET_ID = '1CvuBgaAY0DtayM3yy9WAH5MU-dUwyTkx_iHN1ZDZP-8';

const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');

const creds = require('./config/service_account.json');

async function agree(row) {
  try {
    const doc = new GoogleSpreadsheet(SHEET_ID);
    await promisify(doc.useServiceAccountAuth)(creds);
    const info = await promisify(doc.getInfo)();
    const sheet = info.worksheets[0];

    const cell = await promisify(sheet.getCells)({
      'min-row': row,
      'max-row': row,
      'min-col': 4,
      'max-col': 4,
    });

    cell[0].value = "1";
    cell[0].save();
    return;
  } catch (err) {
    console.log(err);
    alert("Failed to complete action, please contact maintainance.");
  }
}

async function disagree(row) {
  try {
    const doc = new GoogleSpreadsheet(SHEET_ID);
    promisify(doc.useServiceAccountAuth)(creds);
    const info = await promisify(doc.getInfo)();
    const sheet = info.worksheets[0];

    const cell = await promisify(sheet.getCells)({
      'min-row': row,
      'max-row': row,
      'min-col': 4,
      'max-col': 4,
    });

    cell[0].value = "2";
    cell[0].save();
    return;
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

  // agree = async () => {
  //   const row = parseInt(this.state.value, 10) + 1;
  //   alert("Agree " + row);
  //   try {
  //     const verified = await promisify(doc.useServiceAccountAuth)(creds);
  //     const info = await promisify(doc.getInfo)();
  //     const sheet = info.worksheets[0];
  
  //     const cell = await promisify(sheet.getCells)({
  //     'min-row': row,
  //     'max-row': row,
  //     'min-col': 4,
  //     'max-col': 4,
  //     });
  
  //     cell[0].value = "1";
  //     cell[0].save();
  //     return;
  //   } catch (err) {
  //     console.log(err);
  //     alert("Failed to complete action, please contact maintainance.");
  //   }
  // }

  // disagree = async () => {
  //   const row = parseInt(this.state.value, 10) + 1;
  //   alert("Disagree " + row);
  //   try {
  //     const verified = await promisify(doc.useServiceAccountAuth)(creds);
  //     const info = await promisify(doc.getInfo)();
  //     const sheet = info.worksheets[0];
  
  //     const cell = await promisify(sheet.getCells)({
  //       'min-row': row,
  //       'max-row': row,
  //       'min-col': 4,
  //       'max-col': 4,
  //     });
  
  //     cell[0].value = "2";
  //     cell[0].save();
  //     return;
  //   } catch (err) {
  //     console.log(err);
  //     alert("Failed to complete action, please contact maintainance.");
  //   }
  // }

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
    agree(parseInt(this.state.value, 10) + 1)
  }

  updateDisagree = () => {
    disagree(parseInt(this.state.value, 10) + 1);
  }

  render() {
    return (
      <div>   
        <form>
          <label>
            Kode:   REQ-
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