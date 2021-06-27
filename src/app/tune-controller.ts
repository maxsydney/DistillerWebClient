import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SocketService } from './socket.service';
import { ControllerTuningMsg } from './comm-types';
import { ControllerTuning } from './data-types';

@Component({
  selector: 'app-tune-controller',
  templateUrl: './tune-controller.html'
})
export class TuneControllerComponent {
  modalReference: NgbModalRef;
  ctrlTuningNew: ControllerTuning;
  @Input() ctrlTuning: ControllerTuning;
  @Output() messageEvent = new EventEmitter<ControllerTuningMsg>();

  constructor(private modalService: NgbModal,
              private socketService: SocketService) {
  }

  open(content: any) {
    this.ctrlTuningNew = Object.assign(new ControllerTuning(), this.ctrlTuning);
    this.modalReference = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

  sendParams() {
    const PIDmsg = new ControllerTuningMsg;
    PIDmsg.update(this.ctrlTuningNew)

    this.messageEvent.emit(PIDmsg);

    this.modalReference.close();
  }
}
