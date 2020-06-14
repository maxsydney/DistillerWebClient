import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SocketService } from './socket.service';
import { ControllerParamsMsg } from './comm-types';

@Component({
  selector: 'app-tune-controller',
  templateUrl: './tune-controller.html'
})
export class TuneControllerComponent {
  P_gain: string;
  I_gain: string;
  D_gain: string;
  setpoint: string;
  LPFCutoff: string;
  modalReference: NgbModalRef;
  @Output() messageEvent = new EventEmitter<ControllerParamsMsg>();

  constructor(private modalService: NgbModal,
              private socketService: SocketService) {}

    open(content: any) {
       this.modalReference = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    }

    sendParams() {

      const PIDmsg = new ControllerParamsMsg;
      console.log(PIDmsg);

      // Validate input information
      if (isNaN(parseFloat(this.P_gain))) {
        PIDmsg.data.P_gain = -1;
      } else {
        PIDmsg.data.P_gain = parseFloat(this.P_gain);
      }

      if (isNaN(parseFloat(this.I_gain))) {
        PIDmsg.data.I_gain = -1;
      } else {
        PIDmsg.data.I_gain = parseFloat(this.I_gain);
      }

      if (isNaN(parseFloat(this.D_gain))) {
        PIDmsg.data.D_gain = -1;
      } else {
        PIDmsg.data.D_gain = parseFloat(this.D_gain);
      }

      if (isNaN(parseFloat(this.setpoint))) {
        PIDmsg.data.setpoint = -1;
      } else {
        PIDmsg.data.setpoint = parseFloat(this.setpoint);
      }

      if (isNaN(parseFloat(this.LPFCutoff))) {
        PIDmsg.data.LPFCutoff = -1;
      } else {
        PIDmsg.data.LPFCutoff = parseFloat(this.LPFCutoff);
      }

      this.messageEvent.emit(PIDmsg);

      // Set fields back to empty
      this.P_gain = '';
      this.I_gain = '';
      this.D_gain = '';
      this.setpoint = '';
      this.LPFCutoff = '';

      this.modalReference.close();
    }
}
