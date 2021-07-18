import { Component, ViewChild} from '@angular/core';
import { SocketService } from './socket.service';
import { ControllerTuningMsg, ControllerSettingsMsg, OTACommand, ControllerPeripheralStateMsg} from './comm-types';
import { ControllerTuning, ControllerSettings, SystemTemperatures, FlowrateData, ConcentrationData, ControllerPeripheralState, ControllerState} from './data-types';
import { PumpMode } from './data-types';
import { TemperatureChartComponent } from './temperature-chart/temperature-chart.component'
import { ControllerStateChartComponent } from './controller-state-chart/controller-state-chart.component'
import { ConsoleComponent } from './console/console.component'
// import { TemperatureData } from './SensorManagerMessaging'
import { MessageWrapper, PBMessageType } from '../../PBProtobuf/Generated/TypeScript/Proto/MessageBase';

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
  @ViewChild(TemperatureChartComponent) public tempChart: TemperatureChartComponent;
  @ViewChild(ControllerStateChartComponent) public ctrlStateChart: ControllerStateChartComponent;
  @ViewChild(ConsoleComponent) public console: ConsoleComponent;

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

  constructor(private socketService: SocketService) {
    this.socketService.connect('ws://192.168.1.201:80/ws')
      .subscribe(
        msg => {
          console.log(msg)
          this.handleMessage(msg);
        },
        err => {
          console.log('Websocket error detected');
          console.log(err);
        },  
        () => {
          console.log('complete');
        }
    );
  }

  //
  // Process incoming data packets
  //
  handleMessage(msg: any): void {
    let a = MessageWrapper.create();
    console.log(a);
    // switch(msg.MessageType)
    // {
    //   case "Temperature Data":
    //     this.temperatures.update(msg);
    //     this.tempChart.update(this.temperatures, this.ctrlTuning.Setpoint);
    //     break;
    //   case "Controller tuning":
    //     this.ctrlTuning.update(msg);
    //     break
    //   case "Controller settings":
    //     this.ctrlSettings.update(msg);
    //     break;
    //   case "Controller command":
    //     this.ctrlPeripheralState.update(msg);
    //     break;
    //   case "Flowrate Data":
    //     this.flowrates.update(msg);
    //     break;
    //   case "Concentration Data":
    //     this.concentrations.update(msg);
    //     break;
    //   case "Controller State":
    //     this.ctrlState.update(msg);
    //     this.ctrlStateChart.update(this.ctrlState);
    //     break;
    //   case "Socket Log":
    //     this.console.logMessage(msg['Log']);
    //     console.log(msg['Log']);
    //     break;
    // }
  }

  public get PumpMode(): typeof PumpMode {
    return PumpMode; 
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
    this.activeChart = (this.activeChart + 1) % 2;
  }
}

