import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subject} from 'rxjs';
import { SocketService } from '../socket.service';
import { SensorAssignCommand } from '../comm-types';

@Component({
  selector: 'app-assign-sensors',
  templateUrl: './assign-sensors.component.html',
  styleUrls: ['./assign-sensors.component.css']
})
export class AssignSensorsComponent implements OnInit {

  modalReference: NgbModalRef;
  private conn: Observable<string>;
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
      this.startSensorAssignTask();
      this.modalReference = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
      this.conn = this.socketService.connect('ws://192.168.1.202:80/ws');
      this.subscription = this.conn.subscribe(
        msg => {
          if (msg['type'] == 'sensorID') {
            this.processSensorIDs(msg);
          }
        }
      );

      this.modalReference. result.then(() => { }, () => {
        this.stopSensorAssignTask();
        this.subscription.unsubscribe();
      });
    }

    startSensorAssignTask(): void {
      const msg = new SensorAssignCommand();
      this.socketService.sendMessage(JSON.stringify(msg));
    }

    stopSensorAssignTask(): void {
      const msg = new SensorAssignCommand;
      msg.start = 0;
      this.socketService.sendMessage(JSON.stringify(msg));
    }

    processSensorIDs(data: JSON): void {
      const IDstrings = [];
      for (const sensorID of data['sensors']) {
        IDstrings.push(this.toHexString(sensorID));
      }
      this.availableSensors = IDstrings;
    }

    toHexString(byteArray) {
      return byteArray.reduce((output, elem) =>
        (output + ('0' + elem.toString(16)).slice(-2)),
        '');
    }

  ngOnInit() {
  }

}
