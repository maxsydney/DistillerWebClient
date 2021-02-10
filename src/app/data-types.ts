// Define controller parameters ADT.
export class ControllerTuning {
  Setpoint = 0.0;
  PGain = 0.0;
  IGain = 0.0;
  DGain = 0.0;
  LPFCutoff = 0.0;

  update(data: JSON): void {
    this.Setpoint = data['Setpoint'];
    this.PGain = data['PGain'];
    this.IGain = data['IGain'];
    this.DGain = data['DGain'];
    this.LPFCutoff = data['LPFCutoff'];
  }
}

// Define controller settings ADT.
export class ControllerSettings {
  prodPump = 0;
  refluxPump = 0;

  update(data: JSON): void {
    this.prodPump = data['ProdPump'];
    this.refluxPump = data['RefluxPump'];
  }
}

export class ControllerPeripheralState {
  fanState: number;
  LPElement: number;
  HPElement: number;

  constructor() {
    this.fanState = 0;
    this.LPElement = 0;
    this.HPElement = 0;
  }

  update(data: JSON): void {
    this.fanState = data['fanState'];
    this.LPElement = data['LPElement'];
    this.HPElement = data['HPElement']
  }
}

export class SystemTemperatures {
  T_head = 0.0;
  T_reflux = 0.0;
  T_prod = 0.0;
  T_radiator = 0.0;
  T_boiler = 0.0;
  uptime = 0;

  // TODO: Filter doesn't belong here
  update(data: JSON): void {
    this.T_head = this.filter(data['HeadTemp'], this.T_head, 0.25);
    this.T_reflux = this.filter(data['RefluxTemp'], this.T_reflux, 0.25);
    this.T_prod = this.filter(data['ProdTemp'], this.T_prod, 0.25);
    this.T_radiator = this.filter(data['RadiatorTemp'], this.T_radiator, 0.25);
    this.T_boiler = this.filter(data['BoilerTemp'], this.T_boiler, 0.25);
    this.uptime = data['Uptime'] / 1e6;
  }

  getTimeStr(): string {
    let seconds = this.uptime;
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

  filter(newVal: number, oldVal: number, alpha: number): number {
    if (alpha <= 0 || alpha > 1) {
      console.log(`Cannot filter with alpha = ${alpha}`);
      return newVal;
    }

    return (1 - alpha) * oldVal + alpha * newVal;
  }
}

export class FlowrateData {
  refluxFlowrate = 0.0;
  productFlowrate = 0.0;
  uptime = 0;

  update(data: JSON): void {
    this.uptime = data['uptime'];
    this.refluxFlowrate = data['refluxFlowrate'];
    this.productFlowrate = data['productFlowrate'];
  }
}

export class ConcentrationData {
  vapourConcentration = 0.0;
  boilerConcentration = 0.0;
  uptime = 0.0;

  update(data: JSON): void {
    this.uptime = data['uptime'];
    this.vapourConcentration = data['vapourConcentration'];
    this.boilerConcentration = data['boilerConcentration'];
  }
}

export class TempSensor {
  addr: Array<number>;
  task: number;

  constructor() {
    this.addr = [];
    this.task = -1;
  }
}
