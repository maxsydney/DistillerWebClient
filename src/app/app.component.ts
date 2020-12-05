import { Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import { SocketService } from './socket.service';
import { Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TuneControllerComponent } from './tune-controller';
import { ChartService } from './chart-service.service';
import { ControllerTuningMsg, ControllerSettingsMsg, OTACommand } from './comm-types';
import { ControllerTuning, ControllerSettings, SystemTemperatures, SystemSecondaryState } from './data-types';

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
  ctrlTuning = new ControllerTuning;
  ctrlSettings = new ControllerSettings;
  temperatures = new SystemTemperatures;
  secondaryState = new SystemSecondaryState
  activeChart = chartType.mainChart;
  OTA_IP: string;

  chartLabels = [];

  constructor(private socketService: SocketService,
              public chartConfig: ChartService) {
    this.socketService.connect('ws://192.168.1.86:80/ws')
      .subscribe(data => {
        console.log(data);
        switch(data.MessageType)
        {
          case "Temperature":
            this.temperatures.update(data);
            break;

          case "ControlTuning":
            this.ctrlTuning.update(data);
            break

          case "ControlSettings":
            this.ctrlSettings.update(data);
            break;
          
          case "Log":
            console.log(data['log']);
            break;
        }
        this.updateChart();
      });
  }

  updateChart() {
    this.chartLabels.push(this.temperatures.getTimeStr());
    this.chartConfig.dataSeriesMainChart[0].data.push(this.temperatures.T_head);
    this.chartConfig.dataSeriesMainChart[1].data.push(this.ctrlTuning.Setpoint);
    this.chartConfig.dataSeriesMainChart[2].data.push(this.temperatures.T_boiler);
    this.chartConfig.dataSeriesSecondary[0].data.push(this.temperatures.T_prod);
    this.chartConfig.dataSeriesSecondary[1].data.push(this.temperatures.T_radiator);
    this.chartConfig.dataSeriesSecondary[2].data.push(this.temperatures.T_reflux);
    this.chartConfig.dataSeriesConcentration[0].data.push(this.secondaryState.vapConc);
    this.chartConfig.dataSeriesConcentration[1].data.push(this.secondaryState.boilerConc);
    this.chart.chart.update();
  }

  receiveControllerParamsMsg($event) {
    const PIDmsg: ControllerTuningMsg = $event;

    this.socketService.sendMessage(PIDmsg);
    console.log(PIDmsg);
  }

  fanControl(status) {
    this.ctrlSettings.fanState = status;
    const msg = new ControllerSettingsMsg;
    msg.update(this.ctrlSettings);
    this.socketService.sendMessage(msg);
  }

  elementControlLowPower(status) {
    this.ctrlSettings.elementLow = status;
    const msg = new ControllerSettingsMsg;
    msg.update(this.ctrlSettings);
    this.socketService.sendMessage(msg);
  }

  controlProductCondensor(status) {
    this.ctrlSettings.prodPump = status;
    const msg = new ControllerSettingsMsg;
    msg.update(this.ctrlSettings);
    this.socketService.sendMessage(msg);
  }

  controlRefluxCondensor(status) {
    this.ctrlSettings.refluxPump = status;
    const msg = new ControllerSettingsMsg;
    msg.update(this.ctrlSettings);
    this.socketService.sendMessage(msg);
  }

  runOTA() {
    const OTA = new OTACommand;
    OTA.IP = this.OTA_IP;
    this.socketService.sendMessage(JSON.stringify(OTA));
  }

  swapCharts() {
    this.activeChart = (this.activeChart + 1) % 3;
  }
}

