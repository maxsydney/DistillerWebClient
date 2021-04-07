import { Component, OnInit, ViewChild } from '@angular/core';
import { Injectable } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, Label, Color } from 'ng2-charts';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-temperature-chart',
  templateUrl: './temperature-chart.component.html',
  styleUrls: ['./temperature-chart.component.css']
})
export class TemperatureChartComponent implements OnInit {

  test() {
    console.log(this.chart.chart);
  }

  datasets: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Head' },
    { data: [], label: 'Setpoint' },
    { data: [], label: 'Boiler' },
    { data: [], label: 'Product Out' },
    { data: [], label: 'Radiator' },
    { data: [], label: 'Reflux out' }
  ];

  labels: Label = ["1", "2", "3", "4", "5", "6"];

  options: ChartOptions = {
    responsive: true,
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
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,0,0.28)',
    },
  ];

  legend = true;
  plugins = [];
  chartType: ChartType = 'line';

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  constructor() { }

  ngOnInit(): void {
  }

}
