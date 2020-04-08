import { Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import { SocketService } from './socket.service';
import { Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TuneControllerComponent } from './tune-controller';
import { ChartService } from './chart-service.service';

enum chartType {
  mainChart,
  secondaryChart,
  concentrationChart
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  @ViewChild(BaseChartDirective, {static: false})
  public chart: BaseChartDirective;
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
  element1 = false;
  prodCondensor = false;
  Qdot: number;
  activeChart = chartType.mainChart;
  OTA_IP: string;
  vapConc = 0;
  liquidConc = 0;

  chartLabels = [];
  measuredTime = '';

  constructor(private socketService: SocketService,
              public chartConfig: ChartService) {
    this.socketService.connect('ws://192.168.1.202:80/ws')
      .subscribe(dataFrame => {
        if (dataFrame['type'] === 'data') {
          this.updateData(dataFrame);
          this.updateChart();
        } else if (dataFrame['type'] === 'status') {
          this.updateStatus(dataFrame);
        }
      });
  }

  updateChart() {
    this.chartLabels.push(this.measuredTime);
    this.chartConfig.dataSeriesMainChart[0].data.push(this.currentTemps[0]);
    this.chartConfig.dataSeriesMainChart[1].data.push(this.setpoint);
    this.chartConfig.dataSeriesMainChart[2].data.push(this.currentTemps[1]);
    this.chartConfig.dataSeriesSecondary[0].data.push(this.currentTemps[2]);
    this.chartConfig.dataSeriesSecondary[1].data.push(this.currentTemps[3]);
    this.chartConfig.dataSeriesSecondary[2].data.push(this.currentTemps[4]);
    this.chartConfig.dataSeriesConcentration[0].data.push(this.vapConc);
    this.chartConfig.dataSeriesConcentration[1].data.push(this.liquidConc);
    this.chart.chart.update();
  }

  updateData(data) {
    this.currentTemps[0] = this.currentTemps[0] * 0.75 + data.T_vapour * 0.25;
    this.currentTemps[1] = this.currentTemps[1] * 0.75 + data.T_refluxInflow * 0.25;
    this.currentTemps[2] = this.currentTemps[2] * 0.75 + data.T_productInflow * 0.25;
    this.currentTemps[3] = this.currentTemps[3] * 0.75 + data.T_radiator * 0.25;
    this.currentTemps[4] = this.currentTemps[4] * 0.75 + data.T_boiler * 0.25;
    this.setpoint = data.setpoint;
    const time = this.msToHMS(data.uptime);
    this.measuredTime = this.FormatTimeString(time[0], time[1], time[2]);
    this.flowRate = data.flowrate;
    this.P_gain = data.P_gain;
    this.I_gain = data.I_gain;
    this.D_gain = data.D_gain;
    this.Qdot = this.flowRate / 60 * 4.18 * (this.currentTemps[0] - this.currentTemps[1]);
    this.deltaT = this.currentTemps[0] - this.currentTemps[1];
    this.liquidConc = this.liquidConc * 0.7 + data.boilerConc * 0.3;
    this.vapConc = data.vapourConc;
  }

  updateStatus(data) {
    this.fanState = data.fanState;
    this.flush = data.flush;
    this.element1 = data.element1State;
    this.prodCondensor = data.prodCondensorManual;
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

  elementControlLowPower(status) {
    this.element1 = status;
    const message = `CMD&element1:${status}\n`;
    this.socketService.sendMessage(message);
  }

  controlProductCondensor(status) {
    this.prodCondensor = status;
    const message = `CMD&prod:${status}\n`;
    this.socketService.sendMessage(message);
  }

  flushSystem(status) {
    this.flush = status;
    const message = `CMD&flush:${status}\n`;
    this.socketService.sendMessage(message);
  }

  swapTempSensors() {
    const message = 'CMD&swapTempSensors:1\n';
    this.socketService.sendMessage(message);
  }

  runOTA() {
    const message = `CMD&OTA:${this.OTA_IP}\n`;
    console.log(message);
    this.socketService.sendMessage(message);
  }

  swapCharts() {
    this.activeChart = (this.activeChart + 1) % 3;
  }
}

