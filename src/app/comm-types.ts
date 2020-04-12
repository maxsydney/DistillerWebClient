import { ControllerParams, ControllerSettings } from './data-types';

// Define controller parameters message. Sent from browser to Pissbot
export class ControllerParamsMsg {
  type = 'INFO';
  subtype = 'ctrlParams';
  data = new ControllerParams;
}

// Define controller settings message. Sent from browser to Pissbo
export class ControllerSettingsMsg {
  type = 'INFO';
  subtype = 'ctrlSettings';
  data = new ControllerSettings;
}
