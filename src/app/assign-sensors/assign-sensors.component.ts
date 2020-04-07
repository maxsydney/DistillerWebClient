import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-assign-sensors',
  templateUrl: './assign-sensors.component.html',
  styleUrls: ['./assign-sensors.component.css']
})
export class AssignSensorsComponent implements OnInit {

  modalReference: NgbModalRef;
  location = 'Assign to';

  availableSensors = [
    'temp sensor 1',
    'temp sensor 2',
    'temp sensor 3'
  ];

  constructor(private modalService: NgbModal,
              private socketService: SocketService) { }

    open(content: any) {
      this.modalReference = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
      this.socketService.createSocket("ws://192.168.1.201:80/ws")
        .subscribe(data => {
          console.log(data);
        });
    }

  ngOnInit() {
  }

}
