import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subject} from 'rxjs';
import { SocketService } from '../socket.service';
import { SensorAssignCommand, SensorAssignMsg} from '../comm-types';
import { TempSensor } from '../data-types';

@Component({
  selector: 'app-assign-sensors',
  templateUrl: './assign-sensors.component.html',
  styleUrls: ['./assign-sensors.component.css']
})
export class AssignSensorsComponent implements OnInit {

  modalReference: NgbModalRef;
  private conn: Observable<string>;
  subscription: any;
  taskStr: string;
  selectStr: string;
  selectedSensor = new TempSensor;
  availableSensors = [];
  tasks = [
    'Head',
    'Reflux out',
    'Product out',
    'Radiator out',
    'Boiler'
  ];

  constructor(private modalService: NgbModal,
              private socketService: SocketService) { }

    open(content: any) {
      this.startSensorAssignTask();
      this.modalReference = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
      this.conn = this.socketService.connect('ws://192.168.1.202:80/ws');
      this.subscription = this.conn.subscribe(
        msg => {
          if (msg['type'] === 'sensorID') {
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
      this.taskStr = 'Assign to';
      this.selectStr = 'Select sensor';
      this.selectedSensor.addr = [];
      this.selectedSensor.task = -1;
      const msg = new SensorAssignCommand();
      this.socketService.sendMessage(JSON.stringify(msg));
    }

    stopSensorAssignTask(): void {
      const msg = new SensorAssignCommand;
      msg.start = 0;
      this.socketService.sendMessage(JSON.stringify(msg));
    }

    processSensorIDs(data: JSON): void {
      this.availableSensors = data['sensors'];
    }

    toHexString(byteArray) {
      return byteArray.reduce((output, elem) =>
        (output + ('0' + elem.toString(16)).slice(-2)),
        '');
    }

    selectSensor(addr: Array<number>): void {
      this.selectedSensor.addr = addr;
      this.selectStr = this.toHexString(addr);
    }

    selectTask(i: number): void {
      console.log(`Selected task is: ${this.tasks[i]}`);
      this.taskStr = this.tasks[i];
      this.selectedSensor.task = i;
    }

    sendAssignSensorMsg(): void {
      const msg = new SensorAssignMsg;
      msg.update(this.selectedSensor);
      this.socketService.sendMessage(JSON.stringify(msg));
      this.stopSensorAssignTask();
      this.modalReference.close();
    }

  ngOnInit() {
  }

}
