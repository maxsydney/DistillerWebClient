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
export class AppComponent implements OnInit  {
  @ViewChild(BaseChartDirective)
  public chart: BaseChartDirective; // Now you can reference your chart via `this.chart`
  T1 = 0;
  T2 = 0;
  setpoint: number;
  flowRate: number;
  deltaT: number;
  elementStatus: number;
  P_gain: number;
  I_gain: number;
  D_gain: number;
  fanState = false;
  flush = false;
  filter = false;
  Qdot: number;

  dataSeries = [
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
  chartData = [];
  chartLabels = [];
  measuredTime = '';

  constructor(private socketService: SocketService) {
    this.socketService.createSocket('ws://pissbotServer:8080/ws')
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
              this.dataSeries[0].data.push(T1);
              this.dataSeries[2].data.push(T2);
              this.dataSeries[1].data.push(data['setpoint'][i]);
              const time = this.msToHMS(data['time'][i]);
              this.chartLabels.push(this.FormatTimeString(time[0], time[1], time[2]));
            }
            // Set current temp variables so filter continues to run without break
            this.T1 = data['T1'][len - 1];
            this.T2 = data['T2'][len - 1];
          } else {
            // If already connected, server sends one sample of data as [temp, setpoint, time]
            this.updateCurrentVals(data);
            this.chartLabels.push(this.measuredTime);
            this.dataSeries[0].data.push(this.T1);
            this.dataSeries[1].data.push(this.setpoint);
            this.dataSeries[2].data.push(this.T2);
          }
        } catch (err) {
          console.log(`Failed string ${data}`);
        }
      });
  }

  // Chart config
  chartOptions = {
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
          fontSize: 16,
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
          fontSize: 16,
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
    }
  };

  updateChart() {
    this.chart.chart.update();
  }

  updateCurrentVals(data) {
    this.T1 = this.T1 * 0.75 + parseFloat(data[0]) * 0.25;
    this.T2 = this.T2 * 0.75 + parseFloat(data[1]) * 0.25;
    this.setpoint = data[2];
    const time = this.msToHMS(data[3]);
    this.measuredTime = this.FormatTimeString(time[0], time[1], time[2]);
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
    let myvar = '0';

    if (status) {
      myvar = '1';
    }
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

  ngOnInit() {
    setInterval(() => {
      this.updateChart();
    }, 50);
  }
}

