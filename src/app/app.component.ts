import { Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import { SocketService } from './socket.service';
import { Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TuneControllerComponent } from './tune-controller';
import { ChartService } from './chart-service.service';
import { ControllerParamsMsg } from './comm-types';
import { ControllerParams, ControllerSettings, SystemState } from './data-types';

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
  ctrlParams = new ControllerParams;
  ctrlSettings = new ControllerSettings;
  state = new SystemState;
  activeChart = chartType.mainChart;
  OTA_IP: string;

  chartLabels = [];

  constructor(private socketService: SocketService,
              public chartConfig: ChartService) {
    this.socketService.connect('ws://192.168.1.202:80/ws')
      .subscribe(data => {
        if (data.type === 'data') {
          this.state.update(data);
          this.ctrlParams.update(data);
          this.updateChart();
        } else if (data['type'] === 'status') {
          this.ctrlSettings.update(data);
        }
      });
  }

  updateChart() {
    this.chartLabels.push(this.state.getTimeStr());
    this.chartConfig.dataSeriesMainChart[0].data.push(this.state.T_head);
    this.chartConfig.dataSeriesMainChart[1].data.push(this.ctrlParams.setpoint);
    this.chartConfig.dataSeriesMainChart[2].data.push(this.state.T_reflux);
    this.chartConfig.dataSeriesSecondary[0].data.push(this.state.T_prod);
    this.chartConfig.dataSeriesSecondary[1].data.push(this.state.T_radiator);
    this.chartConfig.dataSeriesSecondary[2].data.push(this.state.T_boiler);
    this.chartConfig.dataSeriesConcentration[0].data.push(this.state.vapConc);
    this.chartConfig.dataSeriesConcentration[1].data.push(this.state.boilerConc);
    this.chart.chart.update();
  }

  receiveControllerParamsMsg($event) {
    const PIDmsg: ControllerParamsMsg = $event;

    if (PIDmsg.data.P_gain === -1) {
      PIDmsg.data.P_gain = this.ctrlParams.P_gain;
    }
    if (PIDmsg.data.I_gain === -1) {
      PIDmsg.data.I_gain  = this.ctrlParams.I_gain;
    }
    if (PIDmsg.data.D_gain === -1) {
      PIDmsg.data.D_gain = this.ctrlParams.D_gain;
    }
    if (PIDmsg.data.setpoint === -1) {
      PIDmsg.data.setpoint = this.ctrlParams.setpoint;
    }

    // this.socketService.sendMessage(JSON.stringify(PIDmsg));
    console.log(JSON.stringify(PIDmsg));
  }

  fanControl(status) {
    this.ctrlSettings.fanState = status;
    const message = `CMD&fanState:${status}\n`;
    this.socketService.sendMessage(message);
  }

  elementControlLowPower(status) {
    this.ctrlSettings.elementLow = status;
    const message = `CMD&element1:${status}\n`;
    this.socketService.sendMessage(message);
  }

  controlProductCondensor(status) {
    this.ctrlSettings.prodCondensor = status;
    const message = `CMD&prod:${status}\n`;
    this.socketService.sendMessage(message);
  }

  flushSystem(status) {
    this.ctrlSettings.flush = status;
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

