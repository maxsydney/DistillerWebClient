import { Component, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, Label, Color } from 'ng2-charts';
import { ControllerState } from '../ProtoBuf/ControllerMessaging';

@Component({
  selector: 'app-controller-state-chart',
  templateUrl: './controller-state-chart.component.html',
  styleUrls: ['./controller-state-chart.component.css']
})
export class ControllerStateChartComponent {
  @ViewChild(BaseChartDirective, {static: false})
  public chart: BaseChartDirective;
  chartWidth: number = 3000;    // About 10 minutes of data

  datasets: ChartDataSets[] = [
    { data: [], label: 'Proportional Output' },
    { data: [], label: 'Integral Output' },
    { data: [], label: 'Derivative Output' },
    { data: [], label: 'Total Output' }
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
        scaleLabel: { display: true, fontSize: 22, labelString: 'Ctrl Output' },
        id: 'y-axis-1',
        type: 'linear',
        position: 'left'
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
      text: 'Controller State',
      fontSize: 22
    }
  };
  chartColours: Color[] = [
    { borderColor: "#E69F00" },
    { borderColor: "#56B4E9" },
    { borderColor: "#009E73" },
    { borderColor: "#0072B2" }
  ];

  
  legend = true;
  plugins = [];
  chartType: ChartType = 'line';

  update(ctrlState: ControllerState): void {
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
    this.datasets[0].data.push(ctrlState.propOutput);
    this.datasets[1].data.push(ctrlState.integralOutput);
    this.datasets[2].data.push(ctrlState.derivOutput);
    this.datasets[3].data.push(ctrlState.totalOutput);
    this.labels.push(this.getTimeStr(ctrlState.timeStamp));

    this.chart.chart.update();
  }

  getTimeStr(uptime_us: number): string {
    let seconds = uptime_us / 1e6;
    const hours = Math.floor(seconds / 3600);
    seconds = seconds % 3600;
    const mins = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    return `${this.FormatNumberLength(hours, 2)}:${this.FormatNumberLength(mins, 2)}:${this.FormatNumberLength(seconds, 2)}`;
  }

  FormatNumberLength(num: number, length: number): string {
    let r = '' + num;
    while (r.length < length) {
        r = '0' + r;
    }
    return r;
  }
}
