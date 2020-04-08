import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subject} from 'rxjs';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-assign-sensors',
  templateUrl: './assign-sensors.component.html',
  styleUrls: ['./assign-sensors.component.css']
})
export class AssignSensorsComponent implements OnInit {

  modalReference: NgbModalRef;
  private conn: Observable<JSON>;
  subscription: any;
  location = 'Assign to';

  availableSensors = [
    'temp sensor 1',
    'temp sensor 2',
    'temp sensor 3'
  ];

  constructor(private modalService: NgbModal,
              private socketService: SocketService) { }

    open(content: any) {
      this.runTask();
      this.modalReference = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
      this.conn = this.socketService.connect('ws://192.168.1.202:80/ws');
      this.subscription = this.conn.subscribe(
        msg => {
          console.log(msg);
        }
      );

      this.modalReference. result.then(() => { }, () => { this.subscription.unsubscribe()});
    }

    runTask() {
      this.socketService.sendMessage('TASK&');
    }

  ngOnInit() {
  }

}
