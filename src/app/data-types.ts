// Define controller parameters ADT.
export class ControllerParams {
  setpoint = 0.0;
  P_gain = 0.0;
  I_gain = 0.0;
  D_gain = 0.0;

  update(data: JSON): void {
    this.setpoint = data['setpoint'];
    this.P_gain = data['P_gain'];
    this.I_gain = data['I_gain'];
    this.D_gain = data['D_gain'];
  }
}

// Define controller settings ADT.
export class ControllerSettings {
  fanState = 0;
  flush = 0;
  elementLow = 0;
  elementHigh = 0;
  prodCondensor = 0;

  update(data: JSON): void {
    this.fanState = data['fanState'];
    this.flush = data['flush'];
    this.elementLow = data['elementLow'];
    this.elementHigh = data['elementHigh'];
    this.prodCondensor = data['prodCondensor'];
  }
}

export class SystemState {
  T_head = 0.0;
  T_reflux = 0.0;
  T_prod = 0.0;
  T_radiator = 0.0;
  T_boiler = 0.0;
  uptime = 0;
  flowRate = 0.0;
  delta_T = 0.0;
  Q_dot = 0.0;
  boilerConc = 0.0;
  vapConc = 0.0;

  update(data: JSON): void {
    this.T_head = this.filter(data['T_head'], this.T_head, 0.25);
    this.T_reflux = this.filter(data['T_reflux'], this.T_reflux, 0.25);
    this.T_prod = this.filter(data['T_prod'], this.T_prod, 0.25);
    this.T_radiator = this.filter(data['T_radiator'], this.T_radiator, 0.25);
    this.T_boiler = this.filter(data['T_boiler'], this.T_boiler, 0.25);
    this.uptime = data['uptime'];
    this.flowRate = data['flowrate'];
    this.delta_T = this.T_head - this.T_radiator;
    this.Q_dot = this.flowRate * this.delta_T;
    this.boilerConc = data['boilerConc'];
    this.vapConc = data['vapourConc'];
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
