import { Component } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable} from 'rxjs';
import { SocketService, SocketObservable } from '../socket.service';
import { SensorManagerCommandMessage, DeviceData, SensorManagerCmdType, AssignSensorCommand } from '../ProtoBuf/SensorManagerMessaging'
import { DS18B20Role } from '../ProtoBuf/DS18B20Messaging'
import { MessageOrigin, MessageWrapper, PBMessageType } from '../ProtoBuf/MessageBase';

@Component({
  selector: 'app-assign-sensors',
  templateUrl: './assign-sensors.component.html',
  styleUrls: ['./assign-sensors.component.css']
})
export class AssignSensorsComponent{

  modalReference: NgbModalRef;
  private conn: Observable<any>;
  subscription: any;
  taskStr: string;
  selectStr: string;
  selectedSensor: Uint8Array = new Uint8Array(8);
  availableSensors: DeviceData = DeviceData.create();
  selectedRole: DS18B20Role = DS18B20Role.NONE;
  intervalID;
  tasks = [
    'None',
    'Head',
    'Reflux out',
    'Product out',
    'Radiator out',
    'Boiler'
  ];

  constructor(private modalService: NgbModal,
              private socketService: SocketService) { }

    open(content: any) {
      this.modalReference = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
      let socketObs = this.socketService.getConnection();
      if (socketObs.success) {
        this.conn = socketObs.obs;
        this.subscription = this.conn.subscribe (
          msg => {
            this.handleMessage(msg);
          },
          err => {
            console.log('Websocket error detected');
            console.log(err);
          }, 
          () => {
            console.log('complete');
          }
        );
        this.startSensorAssignTask();
      } else {
        console.log("Connection to Pissbot was not open");
      }

      this.modalReference. result.then(() => { }, () => {
        clearInterval(this.intervalID);
        this.subscription.unsubscribe();
      });
    }

    async handleMessage(msg: any) {
      // Decode wrapper
      let msgBuffer = await new Response(msg).arrayBuffer();
      let arr = new Uint8Array(msgBuffer);
      let wrapped = MessageWrapper.fromBinary(arr);
      
      // Only process deviceData messages
      if (wrapped.type == PBMessageType.DeviceData) {
        this.availableSensors = DeviceData.fromBinary(wrapped.payload);
        console.log(this.availableSensors);
      }
    }

    startSensorAssignTask(): void {
      this.taskStr = 'Assign to';
      this.selectStr = 'Select sensor';
      this.selectedSensor.fill(0);
      this.selectedRole = -1;
      this.requestAvailableSensors();
    }

    requestAvailableSensors(): void {
      const msg = SensorManagerCommandMessage.create();
      msg.cmdType = SensorManagerCmdType.CMD_BROADCAST_SENSORS;

      let wrapped: MessageWrapper = this.wrapMessage(SensorManagerCommandMessage.toBinary(msg), PBMessageType.SensorManagerCommand);
      this.socketService.sendMessage(MessageWrapper.toBinary(wrapped));
    }

    toHexString(byteArray) {
      return byteArray.reduce((output, elem) =>
        (output + ('0' + elem.toString(16)).slice(-2)),
        '');
    }

    selectSensor(sensor: Uint8Array): void {
      this.selectedSensor = sensor;
      this.selectStr = this.toHexString(sensor);
    }

    selectTask(i: number): void {
      this.taskStr = this.tasks[i];
      this.selectedRole = i;
    }

    sendAssignSensorMsg(): void {
      let message = AssignSensorCommand.create();
      message.address = this.selectedSensor;
      message.role = this.selectedRole;
      let wrapped: MessageWrapper = this.wrapMessage(AssignSensorCommand.toBinary(message), PBMessageType.AssignSensor);
      this.socketService.sendMessage(MessageWrapper.toBinary(wrapped));
      this.modalReference.close();
    }

    wrapMessage(messageSerialized: Uint8Array, type: PBMessageType): MessageWrapper {
      let outMsg = MessageWrapper.create();
      outMsg.type = type;
      outMsg.origin = MessageOrigin.Webclient;
      outMsg.payload = messageSerialized;
      return outMsg;
    }
}
