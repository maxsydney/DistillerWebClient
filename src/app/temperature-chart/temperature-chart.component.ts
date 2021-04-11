import { Component, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, Label, Color } from 'ng2-charts';
import { SystemTemperatures } from "../data-types"

@Component({
  selector: 'app-temperature-chart',
  templateUrl: './temperature-chart.component.html',
  styleUrls: ['./temperature-chart.component.css']
})
export class TemperatureChartComponent {
  @ViewChild(BaseChartDirective, {static: false})
  public chart: BaseChartDirective;
  chartWidth: number = 3000;    // About 10 minutes of data

  datasets: ChartDataSets[] = [
    { data: [], label: 'Head' },
    { data: [], label: 'Setpoint' },
    { data: [], label: 'Boiler' },
    { data: [], label: 'Product Out' },
    { data: [], label: 'Radiator' },
    { data: [], label: 'Reflux out' }
  ];

  labels: Label[] = [];

  options: ChartOptions = {
    responsive: true,
    animation: {
      duration: 0,
    },
    elements: {
      line: { fill: false },
      point: { radius: 0 }
    },
    scales: {
      yAxes: [{
        display: true,
        scaleLabel: { display: true, fontSize: 22, labelString: 'Temperature (°C)' },
        id: 'y-axis-1',
        type: 'linear',
        position: 'left',
        ticks: {min: 0, max: 100}
      }],
      xAxes: [{
        display: true,
        scaleLabel: { display: true, fontSize: 22, labelString: 'Run Time' },
        ticks: {
          maxTicksLimit: 30,
        }
      }]
    },
    title: {
      display: true,
      text: 'Main Process',
      fontSize: 22
    }
  };
  chartColours: Color[] = [
    { borderColor: "#E69F00" },
    { borderColor: "#56B4E9" },
    { borderColor: "#009E73" },
    { borderColor: "#0072B2" },
    { borderColor: "#D55E00" },
    { borderColor: "#CC79A7" }
  ];
  legend = true;
  plugins = [];
  chartType: ChartType = 'line';

  update(temperatures: SystemTemperatures, setpoint: number): void {
    // Shift data out of buffer when full
    let dataset: ChartDataSets;
    for (dataset of this.datasets){
      if (dataset.data.length >= this.chartWidth) {
        dataset.data.shift();
      }
    }
    if (this.labels.length >= this.chartWidth) {
      this.labels.shift();
    }

    // Now update
    this.datasets[0].data.push(temperatures.T_head);
    this.datasets[1].data.push(setpoint);
    this.datasets[2].data.push(temperatures.T_boiler);
    this.datasets[3].data.push(temperatures.T_prod);
    this.datasets[4].data.push(temperatures.T_radiator);
    this.datasets[5].data.push(temperatures.T_reflux);
    this.labels.push(temperatures.getTimeStr());

    this.chart.chart.update();
  }
}
