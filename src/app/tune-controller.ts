import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tune-controller',
  templateUrl: './tune-controller.html'
})
export class TuneControllerComponent {
  P_gain: string;
  I_gain: string;
  D_gain: string;
  setpoint: string;
  modalReference: NgbModalRef;
  @Output() messageEvent = new EventEmitter<string>();

  constructor(private modalService: NgbModal) {}

    open(content: any) {
       this.modalReference = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    }

    sendParams() {
      // Validate input information
      if (isNaN(parseFloat(this.P_gain))) {
        this.P_gain = '-1';
      }

      if (isNaN(parseFloat(this.I_gain))) {
        this.I_gain = '-1';
      }

      if (isNaN(parseFloat(this.D_gain))) {
        this.D_gain = '-1';
      }

      if (isNaN(parseFloat(this.setpoint))) {
        this.setpoint = '-1';
      }

      const message = `${this.P_gain},${this.I_gain},${this.D_gain},${this.setpoint}`;
      this.messageEvent.emit(message);

      // Set fields back to empty
      this.P_gain = '';
      this.I_gain = '';
      this.D_gain = '';
      this.setpoint = '';

      this.modalReference.close();
    }
}
