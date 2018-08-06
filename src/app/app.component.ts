import { Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import { SocketService } from './socket.service';
import { Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
// import { Chart } from 'chartjs-plugin-downsample';
import { TuneControllerComponent } from './tune-controller';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  @ViewChild(BaseChartDirective)
  public chart: BaseChartDirective; // Now you can reference your chart via `this.chart`
  T1: number;
  T2: number;
  setpoint: number;
  flowRate: number;
  deltaT: number;
  elementStatus: number;
  P_gain: number;
  I_gain: number;
  D_gain: number;
  fanState = false;
  Qdot: number;
  time = [];
  T1Series = [];
  T2Series = [];
  setpointSeries = [];

  dataSeries = [
    {
      data: [],
      label: 'Distiller outflow temp'
    },
    {
      data: [],
      label: 'Setpoint'
    },
    {
      data: [],
      label: 'Radiator outflow temp'
    }
  ];
  chartData = [];
  chartLabels = [];
  measuredTime = '';

  constructor(private socketService: SocketService) {
    this.socketService.createSocket('ws://raspberrypi:8080/ws')
      .subscribe(data => {
        data = JSON.parse(data);
        if (!Array.isArray(data)) {
          // If initial connection, server sends whole array of data
            for (let i = 0; i < data['T1'].length; i++) {
              // this.chartData.push(data['T1'][i]);
              this.dataSeries[0].data.push(data['T1'][i]);
              this.chartLabels.push(data['time'][i]);
              this.dataSeries[1].data.push(data['setpoint'][i]);
              this.dataSeries[2].data.push(data['T2'][i]);
            }

          } else {
            // If already connected, server sends one sample of data as [temp, setpoint, time]
            const T1 = data[0];
            const T2 = data[1];
            const setpoint = data[2];
            const time = data[3];
            this.updateCurrentVals(data);
            this.chartLabels.push(this.measuredTime);
            this.dataSeries[0].data.push(T1);
            this.dataSeries[1].data.push(setpoint);
            this.dataSeries[2].data.push(T2);
        }
      });
  }

  // Chart config
  chartOptions = {
      responsive: true,
      animation: false,
      downsample: {
          enabled: true,
          threshold: 50,
          preferOriginalData: false,
      },
      elements: {
          line: {
              fill: false,
          },
          point: {
              radius: 0
          }
      },
      scales: {
          yAxes: [{
            display: true,
              scaleLabel: {
                display: true,
                labelString: 'Temperature (°C)'
              },
              id: 'y-axis-1',
              type: 'linear',
              position: 'left',
              ticks: {min: 10, max: 80}
          }],
          xAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Run Time'
              },
              ticks: {
                  maxTicksLimit: 30,
              }
          }]
      },
      gridlines: {
          drawBorder: true
      },
      legend: {
          display: true,
          position: 'right'
      }
  };

  updateChart() {
    this.chart.chart.update();
  }

  updateCurrentVals(data) {
    this.T1 = data[0];
    this.T2 = data[1];
    this.setpoint = data[2];
    this.measuredTime = this.msToHMS(data[3]);
    this.flowRate = data[4];
    this.elementStatus = data[5];
    this.P_gain = data[6];
    this.I_gain = data[7];
    this.D_gain = data[8];
    this.Qdot = this.flowRate / 60 * 4.18 * (this.T1 - this.T2);
    this.deltaT = this.T1 - this.T2;
  }

  msToHMS(seconds) {
    // 1- Convert to seconds:
    // let seconds = ms / 1000;
    // 2- Extract hours:
    const hours = Math.floor(seconds / 3600); // 3,600 seconds in 1 hour
    seconds = seconds % 3600; // seconds remaining after extracting hours
    // 3- Extract minutes:
    const minutes = Math.floor(seconds / 60 ); // 60 seconds in 1 minute
    // 4- Keep only seconds not extracted to minutes:
    seconds = Math.floor(seconds % 60);
    return(hours + ':' + minutes + ':' + seconds);
  }

  receiveControllerParams($event) {
    let message: string = $event;
    const dataArray = message.split(',');
    if (dataArray[0] === '-1') {
      dataArray[0] = this.P_gain.toString();
    }
    if (dataArray[1] === '-1') {
      dataArray[1] = this.I_gain.toString();
    }
    if (dataArray[2] === '-1') {
      dataArray[2] = this.D_gain.toString();
    }
    if (dataArray[3] === '-1') {
      dataArray[3] = this.setpoint.toString();
    }

    message = `INFO&setpoint:${dataArray[3]},P:${dataArray[0]},I:${dataArray[1]},D:${dataArray[2]}`;
    this.socketService.sendMessage(message);
  }

  fanControl(status) {
    this.fanState = status;
    const message = `CMD&fanState:${status}`;
    this.socketService.sendMessage(message);
  }

  swapTempSensors() {
    const message = 'CMD&swapTempSensors:1';
    this.socketService.sendMessage(message);
  }

  refreshScreen() {
    const message = 'PICMD&refreshScreen';
    this.socketService.sendMessage(message);
  }

  ngOnInit() {
    // this.chart.ngOnChanges({});
    setInterval(() => {
      this.updateChart();
    }, 50);
  }
}

