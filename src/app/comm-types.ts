import { ControllerTuning, ControllerSettings, TempSensor, ControllerPeripheralState } from './data-types';

// Define controller tuning message. Sent from browser to Pissbot
export class ControllerTuningMsg {
  type = 'ControlTuning';
  data = new ControllerTuning;

  update(params: ControllerTuning): void {
    this.data = params;
  }
}

// Define controller settings message. Sent from browser to Pissbot
export class ControllerSettingsMsg {
  type = 'ControlSettings';
  data = new ControllerSettings;

  update(settings: ControllerSettings): void {
    this.data = settings;
  }
}

export class ControllerPeripheralStateMsg {
  type = 'PeripheralState';
  data = new ControllerPeripheralState;

  update(state: ControllerPeripheralState) {
    this.data = state;
  }
}

export class SensorAssignMsg {
  type: string;
  subtype: string;
  data: TempSensor;

  constructor() {
    this.type = 'Command';
    this.subtype = 'AssignSensor';
    this.data = new TempSensor;
  }

  update(sensor: TempSensor): void {
    this.data = sensor;
  }
}

export class OTACommand {
  type = 'CMD';
  subtype = 'OTA';
  IP = '';
}

export class SensorAssignCommand {
  public type: string;
  public subtype: string;
  public start: number;

  constructor() {
    this.type = 'Command';
    this.subtype = 'BroadcastDevices';
    this.start = 1;
  }
}
