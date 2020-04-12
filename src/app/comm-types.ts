import { ControllerParams, ControllerSettings } from './data-types';

// Define controller parameters message. Sent from browser to Pissbot
export class ControllerParamsMsg {
  type = 'INFO';
  subtype = 'ctrlParams';
  data = new ControllerParams;

  update(params: ControllerParams): void {
    this.data = params;
  }
}

// Define controller settings message. Sent from browser to Pissbot
export class ControllerSettingsMsg {
  type = 'INFO';
  subtype = 'ctrlSettings';
  data = new ControllerSettings;

  update(settings: ControllerSettings): void {
    this.data = settings;
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
    this.type = 'CMD';
    this.subtype = 'ASSIGN';
    this.start = 1;
  }
}
