import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SocketService } from './socket.service';

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
  @Output() messageEvent = new EventEmitter<any>();

  constructor(private modalService: NgbModal,
              private socketService: SocketService) {}

    open(content: any) {
       this.modalReference = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    }

    sendParams() {
      const PIDmsg = {
        type: 'INFO',
        arg: 'TUNE',
        setpoint: 0,
        P_gain: 0,
        I_gain: 0,
        D_gain: 0
      };

      // Validate input information
      if (isNaN(parseFloat(this.P_gain))) {
        PIDmsg.P_gain = -1;
      } else {
        PIDmsg.P_gain = parseFloat(this.P_gain);
      }

      if (isNaN(parseFloat(this.I_gain))) {
        PIDmsg.I_gain = -1;
      } else {
        PIDmsg.I_gain = parseFloat(this.I_gain);
      }

      if (isNaN(parseFloat(this.D_gain))) {
        PIDmsg.D_gain = -1;
      } else {
        PIDmsg.D_gain = parseFloat(this.D_gain);
      }

      if (isNaN(parseFloat(this.setpoint))) {
        PIDmsg.setpoint = -1;
      } else {
        PIDmsg.setpoint = parseFloat(this.setpoint);
      }

      // this.socketService.sendMessage(JSON.stringify(PIDmsg).replace(/\\/g, ''));
      // console.log(JSON.stringify(PIDmsg).replace(/\\/g, ''));

      // const message = `${this.P_gain},${this.I_gain},${this.D_gain},${this.setpoint}`;
      this.messageEvent.emit(PIDmsg);

      // Set fields back to empty
      this.P_gain = '';
      this.I_gain = '';
      this.D_gain = '';
      this.setpoint = '';

      this.modalReference.close();
    }
}
