import { Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import { SocketService } from './socket.service';
import { Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TuneControllerComponent } from './tune-controller';
import { ChartService } from './chart-service.service';
import { ControllerTuningMsg, ControllerSettingsMsg, OTACommand, ControllerPeripheralStateMsg } from './comm-types';
import { ControllerTuning, ControllerSettings, SystemTemperatures, FlowrateData, ConcentrationData, ControllerPeripheralState } from './data-types';

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
  ctrlPeripheralState = new ControllerPeripheralState;
  temperatures = new SystemTemperatures;
  flowrates = new FlowrateData;
  concentrations = new ConcentrationData;
  activeChart = chartType.mainChart;
  OTA_IP: string;

  chartLabels = [];

  constructor(private socketService: SocketService,
              public chartConfig: ChartService) {
    this.socketService.connect('ws://192.168.1.201:80/ws')
      .subscribe(data => {
        console.log(data);
        switch(data.MessageType)
        {
          case "Temperature Data":
            this.temperatures.update(data);
            this.updateTemperatureChart();
            break;
          case "Controller tuning":
            this.ctrlTuning.update(data);
            break
          case "ControlSettings":
            this.ctrlSettings.update(data);
            break;
          case "Controller command":
            this.ctrlPeripheralState.update(data);
            break;
          case "Flowrate Data":
            this.flowrates.update(data);
            break;
          case "Log":
            console.log(data['log']);
            break;
        }
      });
  }

  updateTemperatureChart() {
    this.chartLabels.push(this.temperatures.getTimeStr());
    this.chartConfig.dataSeriesMainChart[0].data.push(this.temperatures.T_head);
    this.chartConfig.dataSeriesMainChart[1].data.push(this.ctrlTuning.Setpoint);
    this.chartConfig.dataSeriesMainChart[2].data.push(this.temperatures.T_boiler);
    this.chartConfig.dataSeriesMainChart[3].data.push(this.temperatures.T_prod);
    this.chartConfig.dataSeriesMainChart[4].data.push(this.temperatures.T_radiator);
    this.chartConfig.dataSeriesMainChart[5].data.push(this.temperatures.T_reflux);
    // this.chartConfig.dataSeriesConcentration[0].data.push(this.flowrates.vapConc);
    // this.chartConfig.dataSeriesConcentration[1].data.push(this.flowrates.boilerConc);
    this.chart.chart.update();
  }

  receiveControllerParamsMsg($event) {
    const PIDmsg: ControllerTuningMsg = $event;

    this.socketService.sendMessage(PIDmsg);
    console.log(PIDmsg);
  }

  fanControl(status) {
    var updatedState = JSON.parse(JSON.stringify(this.ctrlPeripheralState));
    updatedState.fanState = status;
    const msg = new ControllerPeripheralStateMsg;
    msg.update(updatedState);
    this.socketService.sendMessage(msg);
  }

  elementControlLowPower(increment) {
    var updatedState = JSON.parse(JSON.stringify(this.ctrlPeripheralState));
    updatedState.LPElement += increment;
    if (updatedState.LPElement > 1.0) {
      updatedState.LPElement= 0.0;
    }
    const msg = new ControllerPeripheralStateMsg;
    msg.update(updatedState);
    this.socketService.sendMessage(msg);
  }

  elementControlHighPower(increment) {
    var updatedState = JSON.parse(JSON.stringify(this.ctrlPeripheralState));
    updatedState.HPElement += increment;
    if (updatedState.HPElement > 1.0) {
      updatedState.HPElement = 0.0;
    }
    const msg = new ControllerPeripheralStateMsg;
    msg.update(updatedState);
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

  convertFlowRateVolToMass(vDot) {
    // Convert flowrate from l/min to kg/s
    // Note: Assumes 1L = 1kg
    return vDot / 60.0;
  }

  computeQDot(mDot, deltaT) {
    // Compute heat flowrate
    return deltaT * mDot;
  }

  runOTA() {
    const OTA = new OTACommand;
    OTA.IP = this.OTA_IP;
    this.socketService.sendMessage(JSON.stringify(OTA));
  }

  swapCharts() {
    this.activeChart = (this.activeChart + 1) % 2;
  }
}

