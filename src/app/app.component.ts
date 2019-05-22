import { Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import { SocketService } from './socket.service';
import { Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
// import { Chart } from 'chartjs-plugin-downsample';
import { TuneControllerComponent } from './tune-controller';
import { splitMatchedQueriesDsl } from '@angular/core/src/view/util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  @ViewChild(BaseChartDirective)
  public chart: BaseChartDirective; // Now you can reference your chart via `this.chart`
  currentTemps = [0, 0, 0, 0, 0];
  setpoint: number;
  flowRate: number;
  deltaT: number;
  elementStatus: number;
  P_gain = 0;
  I_gain = 0;
  D_gain = 0;
  fanState = false;
  flush = false;
  filter = false;
  Qdot: number;
  mainChart = true;

  dataSeriesMainChart = [
    {
      data:  [],
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

  dataSeriesSecondary = [
    {
      data:  [],
      label: 'Product in'
    },
    {
      data: [],
      label: 'Product out'
    },
    {
      data: [],
      label: 'Boiler'
    }
  ];
  chartData = [];
  chartLabels = [];
  measuredTime = '';

  constructor(private socketService: SocketService) {
    // this.socketService.createSocket('ws://pissbotServer:8080/ws')
    this.socketService.createSocket('ws://192.168.1.201:80/ws')
      .subscribe(data => {
        try {
          data = JSON.parse(data);
          let len: number;
          if (!Array.isArray(data)) {
            // If initial connection, server sends whole array of data
            len = data['T1'].length;
            for (let i = 1; i < len; i++) {
              // IIR filter on temperature data for smoothing plotting
              const T1 = data['T1'][i - 1] * 0.75 + data['T1'][i] * 0.25;
              const T2 = data['T2'][i - 1] * 0.75 + data['T2'][i] * 0.25;
              data['T1'][i] = T1;
              data['T2'][i] = T2;

              // Push data to chart series
              this.dataSeriesMainChart[0].data.push(T1);
              this.dataSeriesMainChart[2].data.push(T2);
              this.dataSeriesMainChart[1].data.push(data['setpoint'][i]);
              const time = this.msToHMS(data['time'][i]);
              this.chartLabels.push(this.FormatTimeString(time[0], time[1], time[2]));
            }
            // Set current temp variables so filter continues to run without break
            this.currentTemps[0] = data['T1'][len - 1];
            this.currentTemps[1] = data['T2'][len - 1];
          } else {
            // If already connected, server sends one sample of data as [temp, setpoint, time]
            this.updateCurrentVals(data);
            this.updateChart();
          }
        } catch (err) {
          console.log(`Failed string ${data}`);
        }
      });
  }

  // Main chart config
  chartOptionsMain = {
    responsive: true,
    animation: false,
    cubicInterpolationMode: 'monotone',
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
          fontSize: 22,
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
          fontSize: 22,
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
      position: 'top'
    },
    title: {
      display: true,
      text: "Main Process",
      fontSize: 22
    }
  };

  // Secondary chart config
  chartOptionsSecondary = {
    responsive: true,
    animation: false,
    cubicInterpolationMode: 'monotone',
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
          fontSize: 22,
          labelString: 'Temperature (°C)'
        },
        id: 'y-axis-1',
        type: 'linear',
        position: 'left',
        ticks: {min: -10, max: 80}
      }],
      xAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          fontSize: 22,
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
      position: 'top'
    },
    title: {
      display: true,
      text: "Auxilliary Data",
      fontSize: 22
    }
  };

  updateChart() {
    this.chartLabels.push(this.measuredTime);
    this.dataSeriesMainChart[0].data.push(this.currentTemps[0]);
    this.dataSeriesMainChart[1].data.push(this.setpoint);
    this.dataSeriesMainChart[2].data.push(this.currentTemps[1]);
    this.dataSeriesSecondary[0].data.push(this.currentTemps[2]);
    this.dataSeriesSecondary[1].data.push(this.currentTemps[3]);
    this.dataSeriesSecondary[2].data.push(this.currentTemps[4]);
    this.chart.chart.update();
  }

  updateCurrentVals(data) {
    console.log(data);
    this.currentTemps[0] = this.currentTemps[0] * 0.75 + parseFloat(data[0]) * 0.25;
    this.currentTemps[1] = this.currentTemps[1] * 0.75 + parseFloat(data[1]) * 0.25;
    this.currentTemps[2] = this.currentTemps[2] * 0.75 + parseFloat(data[2]) * 0.25;
    this.currentTemps[3] = this.currentTemps[3] * 0.75 + parseFloat(data[3]) * 0.25;
    this.currentTemps[4] = this.currentTemps[4] * 0.75 + parseFloat(data[4]) * 0.25;
    this.setpoint = data[5];
    const time = this.msToHMS(data[6]);
    this.measuredTime = this.FormatTimeString(time[0], time[1], time[2]);
    this.flowRate = data[7];
    this.elementStatus = data[8];
    this.P_gain = data[9];
    this.I_gain = data[10];
    this.D_gain = data[11];
    this.Qdot = this.flowRate / 60 * 4.18 * (this.currentTemps[0] - this.currentTemps[1]);
    this.deltaT = this.currentTemps[0] - this.currentTemps[1];
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
    // return(hours + ':' + minutes + ':' + seconds);
    return [hours, minutes, seconds];
  }

  FormatNumberLength(num, length) {
    let r = '' + num;
    while (r.length < length) {
        r = '0' + r;
    }
    return r;
  }

  FormatTimeString(hours, mins, seconds) {
    return `${this.FormatNumberLength(hours, 2)}:${this.FormatNumberLength(mins, 2)}:${this.FormatNumberLength(seconds, 2)}`;
  }

  receiveControllerParams($event) {
    let message: string = $event;
    console.log(message);
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

    message = `INFO&setpoint:${dataArray[3]},P:${dataArray[0]},I:${dataArray[1]},D:${dataArray[2]}\n`;
    this.socketService.sendMessage(message);
  }

  fanControl(status) {
    this.fanState = status;
    const message = `CMD&fanState:${status}\n`;
    this.socketService.sendMessage(message);
  }

  flushSystem(status) {
    this.flush = status;
    const message = `CMD&flush:${status}\n`;
    this.socketService.sendMessage(message);
  }

  filterTempSensors(status) {
    this.filter = status;
    const message = `CMD&filterT:${status}\n`;
    this.socketService.sendMessage(message);
  }

  swapTempSensors() {
    const message = 'CMD&swapTempSensors:1\n';
    this.socketService.sendMessage(message);
  }

  refreshScreen() {
    const message = 'PICMD&refreshScreen\n';
    this.socketService.sendMessage(message);
  }

  runOTA() {
    const message = 'CMD&OTA:1\n';
    this.socketService.sendMessage(message);
  }

  swapCharts() {
    this.mainChart = !this.mainChart;
  }
}

