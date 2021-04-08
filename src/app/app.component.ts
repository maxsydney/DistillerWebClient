import { Component, ViewChild} from '@angular/core';
import { SocketService } from './socket.service';
import { ControllerTuningMsg, ControllerSettingsMsg, OTACommand, ControllerPeripheralStateMsg} from './comm-types';
import { BaseChartDirective } from 'ng2-charts';
import { ChartService } from './chart-service.service';
import { ControllerTuning, ControllerSettings, SystemTemperatures, FlowrateData, ConcentrationData, ControllerPeripheralState, ControllerState} from './data-types';
import { PumpMode } from './data-types';
import { TemperatureChartComponent } from './temperature-chart/temperature-chart.component'

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
  @ViewChild(TemperatureChartComponent)
  public tempChart: TemperatureChartComponent;

  ctrlTuning = new ControllerTuning;
  ctrlSettings = new ControllerSettings;
  ctrlPeripheralState = new ControllerPeripheralState;
  ctrlState = new ControllerState;
  temperatures = new SystemTemperatures;
  flowrates = new FlowrateData;
  concentrations = new ConcentrationData;
  activeChart = chartType.mainChart;
  OTA_IP: string;

  chartLabels = [];
  chartLabelsCtrlState = [];

  constructor(private socketService: SocketService,
              public chartConfig: ChartService) {
    this.socketService.connect('ws://192.168.1.201:80/ws')
      .subscribe(data => {
        switch(data.MessageType)
        {
          case "Temperature Data":
            this.temperatures.update(data);
            this.tempChart.update(this.temperatures, this.ctrlTuning.Setpoint);
            break;
          case "Controller tuning":
            this.ctrlTuning.update(data);
            break
          case "Controller settings":
            this.ctrlSettings.update(data);
            break;
          case "Controller command":
            this.ctrlPeripheralState.update(data);
            break;
          case "Flowrate Data":
            this.flowrates.update(data);
            break;
          case "Concentration Data":
            this.concentrations.update(data);
            break;
          case "Controller State":
            this.ctrlState.update(data);
            this.updateControllerStateChart();
            break;
          case "Log":
            console.log(data['log']);
            break;
        }
      });
  }

  public get PumpMode(): typeof PumpMode {
    return PumpMode; 
  }

  updateControllerStateChart() {
    // this.chartLabelsCtrlState.push(this.ctrlState.getTimeStr());
    // this.chartConfig.dataSeriesControllerState[0].data.push(this.ctrlState.proportionalOutput);
    // this.chartConfig.dataSeriesControllerState[1].data.push(this.ctrlState.integralOutput);
    // this.chartConfig.dataSeriesControllerState[2].data.push(this.ctrlState.derivativeOutout);
    // this.chartConfig.dataSeriesControllerState[3].data.push(this.ctrlState.totalOutput);
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

  controlProductCondensor() {
    var updatedState = JSON.parse(JSON.stringify(this.ctrlSettings));
    const status = (updatedState.productPumpMode + 1) % 3;
    updatedState.productPumpMode = status;
    if (status == PumpMode.ManualControl) {
      updatedState.productPumpSpeedManual = 1024;
    }
    const msg = new ControllerSettingsMsg;
    msg.update(updatedState);
    this.socketService.sendMessage(msg);
  }

  controlRefluxCondensor() {
    var updatedState = JSON.parse(JSON.stringify(this.ctrlSettings));
    const status = (updatedState.refluxPumpMode + 1) % 3;
    updatedState.refluxPumpMode = status;
    if (status == PumpMode.ManualControl) {
      updatedState.refluxPumpSpeedManual = 1024;
    }
    const msg = new ControllerSettingsMsg;
    msg.update(updatedState);
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
    this.activeChart = (this.activeChart + 1) % 3;
  }
}

