import React, { Component } from "react";
import { Polar, Doughnut } from "react-chartjs-2";
import axios from "axios";

class PolarGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      label: "Revenue in Crores",
      labels: [],
      data: [],
      options: {
        legend: {
          display: true,
          position: "right",
          labels: {}
        }
      },
      backgroundColor: []
    };
    this.getFinancialData();
  }
  compare = (a, b) => {
    if (a.key > b.key) return -1;
    if (a.key < b.key) return 1;
    return 0;
  };

  getFinancialData = () => {
    axios
      .get("https://data.gov.in/node/5716961/datastore/export/json")
      .then(response => {
        var revenueMinistryArray = [];
        var ministryArray = [];
        var revenueArray = [];
        var colorArray = [];
        for (var i = 0; i < response.data.data.length; i++) {
          var tempObject = {
            key: Number(response.data.data[i][2]),
            value: response.data.data[i][1],
            color: this.getProperColor()
          };
          revenueMinistryArray.push(tempObject);
        }
        revenueMinistryArray.sort(this.compare);
        console.log("revenueMinistryArray", revenueMinistryArray);
        for (var i = 0; i < revenueMinistryArray.length; i++) {
          revenueArray.push(revenueMinistryArray[i].key);
          if (i < 10) ministryArray.push(revenueMinistryArray[i].value);
          colorArray.push(revenueMinistryArray[i].color);
        }
        this.updateStateWithFiscalData(ministryArray, revenueArray, colorArray);
      });
  };
  updateStateWithFiscalData = (ministry, revenue, color) => {
    this.setState({
      labels: ministry,
      data: revenue,
      backgroundColor: color
    });
  };
  getRandomColor = () => {
    return Math.floor(Math.random() * 255 + 1);
  };
  getProperColor = () => {
    var rgba = "rgba(";
    var comma = ",";
    var ending = "1)";

    return (
      rgba +
      this.getRandomColor() +
      comma +
      this.getRandomColor() +
      comma +
      this.getRandomColor() +
      comma +
      ending
    );
  };
  getDataForPolar = () => {
    return {
      labels: this.state.labels,
      options: this.state.options,
      datasets: [
        {
          label: "Revenue in Crores",
          data: this.state.data,
          backgroundColor: this.state.backgroundColor
        }
      ]
    };
  };
  render() {
    return (
      <div>
        <Doughnut
          data={this.getDataForPolar()}
          width={1920}
          height={1080}
          options={this.state.options}
        />
      </div>
    );
  }
}

export default PolarGraph;
