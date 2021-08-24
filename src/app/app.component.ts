import { Component, ViewChild} from '@angular/core';
import { SocketService } from './socket.service';
import { TemperatureChartComponent } from './temperature-chart/temperature-chart.component'
import { ControllerStateChartComponent } from './controller-state-chart/controller-state-chart.component'
import { ConsoleComponent } from './console/console.component'
import { TemperatureData, FlowrateData, ConcentrationData} from './ProtoBuf/SensorManagerMessaging'
import { MessageOrigin, MessageWrapper, PBMessageType } from './ProtoBuf/MessageBase';
import { ControllerTuning, ControllerSettings, ControllerState, PumpMode, ControllerCommand } from './ProtoBuf/ControllerMessaging';
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

  ctrlTuning: ControllerTuning = ControllerTuning.create();
  ctrlSettings: ControllerSettings = ControllerSettings.create();
  ctrlPeripheralState: ControllerCommand = ControllerCommand.create();
  ctrlState: ControllerState = ControllerState.create();
  temperatures: TemperatureData = TemperatureData.create();
  flowrates: FlowrateData = FlowrateData.create();
  concentrations: ConcentrationData = ConcentrationData.create();
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
        break;
    }
  }

  public get PumpMode(): typeof PumpMode {
    return PumpMode; 
  }

  receiveControllerParamsMsg($event) {
    let PIDmsg: ControllerTuning = $event;
    let wrapped: MessageWrapper = this.wrapMessage(ControllerTuning.toBinary(PIDmsg), PBMessageType.ControllerTuning);
    console.log(wrapped);
    this.socketService.sendMessage(MessageWrapper.toBinary(wrapped));
  }

  fanControl(status: any) {
    var ctrlCommand = ControllerCommand.create(this.ctrlPeripheralState);
    ctrlCommand.fanState = status;

    let wrapped: MessageWrapper = this.wrapMessage(ControllerCommand.toBinary(ctrlCommand), PBMessageType.ControllerCommand);
    this.socketService.sendMessage(MessageWrapper.toBinary(wrapped));
  }

  elementControlLowPower(increment) {
    var ctrlCommand = ControllerCommand.create(this.ctrlPeripheralState);
    ctrlCommand.lPElementDutyCycle += increment;

    if (ctrlCommand.lPElementDutyCycle > 1.0) {
      ctrlCommand.lPElementDutyCycle = 0;
    }
    
    let wrapped: MessageWrapper = this.wrapMessage(ControllerCommand.toBinary(ctrlCommand), PBMessageType.ControllerCommand);
    this.socketService.sendMessage(MessageWrapper.toBinary(wrapped));
  }

  elementControlHighPower(increment) {
    var ctrlCommand = ControllerCommand.create(this.ctrlPeripheralState);
    ctrlCommand.hPElementDutyCycle += increment;

    if (ctrlCommand.hPElementDutyCycle > 1.0) {
      ctrlCommand.hPElementDutyCycle = 0;
    }
    
    let wrapped: MessageWrapper = this.wrapMessage(ControllerCommand.toBinary(ctrlCommand), PBMessageType.ControllerCommand);
    this.socketService.sendMessage(MessageWrapper.toBinary(wrapped));
  }

  controlProductCondensor() {
    var ctrlSettings = ControllerSettings.create(this.ctrlSettings);
    ctrlSettings.productPumpMode = (ctrlSettings.productPumpMode + 1) % 3
    
    let wrapped: MessageWrapper = this.wrapMessage(ControllerSettings.toBinary(ctrlSettings), PBMessageType.ControllerSettings);
    this.socketService.sendMessage(MessageWrapper.toBinary(wrapped));
  }

  async controlRefluxCondensor() {
    var ctrlSettings = ControllerSettings.create(this.ctrlSettings);
    ctrlSettings.refluxPumpMode = (ctrlSettings.refluxPumpMode + 1) % 3
    
    let wrapped: MessageWrapper = this.wrapMessage(ControllerSettings.toBinary(ctrlSettings), PBMessageType.ControllerSettings);
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
    // const OTA = new OTACommand;
    // OTA.IP = this.OTA_IP;
    // this.socketService.sendMessage(JSON.stringify(OTA));
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
    let outMsg = MessageWrapper.create();
    outMsg.type = type;
    outMsg.origin = MessageOrigin.Webclient;
    outMsg.payload = messageSerialized;
    return outMsg;
  }
}

