import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SocketService } from './socket.service';
import { ControllerTuning } from './ProtoBuf/ControllerMessaging';

@Component({
  selector: 'app-tune-controller',
  templateUrl: './tune-controller.html'
})
export class TuneControllerComponent {
  modalReference: NgbModalRef;
  ctrlTuningNew: ControllerTuning;
  @Input() ctrlTuning: ControllerTuning;
  @Output() messageEvent = new EventEmitter<ControllerTuning>();

  constructor(private modalService: NgbModal) {}

    open(content: any) {
      this.ctrlTuningNew = ControllerTuning.create(this.ctrlTuning);
      this.modalReference = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    }

    sendParams() {
      this.messageEvent.emit(this.ctrlTuningNew);
      this.modalReference.close();
    }
}
