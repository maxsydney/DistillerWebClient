import { Component, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, Label, Color } from 'ng2-charts';
import { ControllerState } from "../data-types"

@Component({
  selector: 'app-controller-state-chart',
  templateUrl: './controller-state-chart.component.html',
  styleUrls: ['./controller-state-chart.component.css']
})
export class ControllerStateChartComponent {
  @ViewChild(BaseChartDirective, {static: false})
  public chart: BaseChartDirective;

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
  chartColours: Color[] = [];
  legend = true;
  plugins = [];
  chartType: ChartType = 'line';

  update(ctrlState: ControllerState): void {
    this.datasets[0].data.push(ctrlState.proportionalOutput);
    this.datasets[1].data.push(ctrlState.integralOutput);
    this.datasets[2].data.push(ctrlState.derivativeOutout)
    this.datasets[3].data.push(ctrlState.totalOutput)
    this.labels.push(ctrlState.getTimeStr());

    this.chart.chart.update();
  }
}
