import { Component, ViewChild} from '@angular/core';
import { SocketService } from './socket.service';
import { ControllerTuningMsg, ControllerSettingsMsg, OTACommand, ControllerPeripheralStateMsg} from './comm-types';
import { TemperatureChartComponent } from './temperature-chart/temperature-chart.component'
import { ControllerStateChartComponent } from './controller-state-chart/controller-state-chart.component'
import { ConsoleComponent } from './console/console.component'
import { TemperatureData, FlowrateData, ConcentrationData} from './ProtoBuf/SensorManagerMessaging'
import { MessageWrapper, PBMessageType } from './ProtoBuf/MessageBase';
import { ControllerTuning, ControllerSettings, ControllerState, PumpMode, ControllerCommand, ComponentState } from './ProtoBuf/ControllerMessaging';
import { SocketLogMessage } from './ProtoBuf/WebserverMessaging';

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

  ctrlTuning: ControllerTuning;
  ctrlSettings: ControllerSettings;
  ctrlPeripheralState: ControllerCommand;
  ctrlState: ControllerState;
  temperatures: TemperatureData;
  flowrates: FlowrateData;
  concentrations: ConcentrationData;
  activeChart = chartType.mainChart;
  OTA_IP: string;

  chartLabels = [];
  chartLabelsCtrlState = [];

  constructor(private socketService: SocketService) {
    this.socketService.connect('ws://192.168.1.201:80/ws')
      .subscribe(
        msg => {
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
  async handleMessage(msg: any) {
    // Decode wrapper
    let msgBuffer = await new Response(msg).arrayBuffer();
    let arr = new Uint8Array(msgBuffer);
    let wrapped = MessageWrapper.fromBinary(arr);

    // Decode payload
    switch(wrapped.type)
    {
      case PBMessageType.TemperatureData:
        this.temperatures = TemperatureData.fromBinary(wrapped.payload);
        this.tempChart.update(this.temperatures, this.ctrlTuning.setpoint);
        break;
      case PBMessageType.ControllerTuning:
        this.ctrlTuning = ControllerTuning.fromBinary(wrapped.payload);
        break
      case PBMessageType.ControllerSettings:
        this.ctrlSettings = ControllerSettings.fromBinary(wrapped.payload);
        break;
      case PBMessageType.ControllerCommand:
        this.ctrlPeripheralState = ControllerCommand.fromBinary(wrapped.payload);
        break;
      case PBMessageType.FlowrateData:
        this.flowrates = FlowrateData.fromBinary(wrapped.payload);
        break;
      case PBMessageType.ConcentrationData:
        this.concentrations = ConcentrationData.fromBinary(wrapped.payload);
        break;
      case PBMessageType.ControllerState:
        this.ctrlState = ControllerState.fromBinary(wrapped.payload);
        this.ctrlStateChart.update(this.ctrlState);
        break;
      case PBMessageType.SocketLog:
        let logMsg = SocketLogMessage.fromBinary(wrapped.payload);
        this.console.logMessage(logMsg.logMsg);
        // console.log(logMsg.logMsg);
        break;
    }
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
    if (status == PumpMode.MANUAL_CONTROL) {
      updatedState.productPumpSpeedManual = 1024;
    }
    const msg = new ControllerSettingsMsg;
    msg.update(updatedState);
    this.socketService.sendMessage(msg);
  }

  controlRefluxCondensor() {
    var ctrlState = ControllerState.create(this.ctrlState);
    ctrlState.propOutput = 5;

    console.log(ControllerState.toBinary(ctrlState));
    
    let wrapped: MessageWrapper = this.wrapMessage(ControllerState.toBinary(ctrlState), PBMessageType.ControllerState);
    console.log(wrapped);
    this.socketService.sendMessage(MessageWrapper.toBinary(wrapped));
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

  // The following two functions are duplicates. Figure out a way to share these amongst all modules
  getTimeStr(uptime_us: number): string {
    let seconds = uptime_us / 1e6;
    const hours = Math.floor(seconds / 3600);
    seconds = seconds % 3600;
    const mins = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    return `${this.FormatNumberLength(hours, 2)}:${this.FormatNumberLength(mins, 2)}:${this.FormatNumberLength(seconds, 2)}`;
  }

  FormatNumberLength(num: number, length: number): string {
    let r = '' + num;
    while (r.length < length) {
        r = '0' + r;
    }
    return r;
  }

  wrapMessage(messageSerialized: Uint8Array, type: PBMessageType): MessageWrapper {
    // TODO: How to specify base interface type as type
    let outMsg = MessageWrapper.create();
    outMsg.type = type;
    outMsg.payload = messageSerialized;
    return outMsg;
  }
}

