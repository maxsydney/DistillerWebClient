import { Component } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable} from 'rxjs';
import { SocketService, SocketObservable } from '../socket.service';
import { SensorManagerCommandMessage, DeviceData, SensorManagerCmdType, AssignSensorCommand } from '../ProtoBuf/SensorManagerMessaging'
import { DS18B20Sensor } from '../ProtoBuf/DS18B20Messaging'
import { MessageWrapper, PBMessageType } from '../ProtoBuf/MessageBase';

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
  selectedSensor: DS18B20Sensor = DS18B20Sensor.create();
  availableSensors: DeviceData = DeviceData.create();
  intervalID;
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
      }
    }

    startSensorAssignTask(): void {
      this.taskStr = 'Assign to';
      this.selectStr = 'Select sensor';
      this.selectedSensor.romCode.fill(0);
      this.selectedSensor.role = -1;
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

    selectSensor(sensor: DS18B20Sensor): void {
      this.selectedSensor = sensor;
      this.selectStr = this.toHexString(sensor.romCode);
    }

    selectTask(i: number): void {
      this.taskStr = this.tasks[i];
      this.selectedSensor.role = i;
    }

    sendAssignSensorMsg(): void {
      let message = AssignSensorCommand.create();
      message.sensor = this.selectedSensor;
      let wrapped: MessageWrapper = this.wrapMessage(AssignSensorCommand.toBinary(message), PBMessageType.AssignSensor);
      this.socketService.sendMessage(MessageWrapper.toBinary(wrapped));
      console.log(message);
      this.modalReference.close();
    }

    wrapMessage(messageSerialized: Uint8Array, type: PBMessageType): MessageWrapper {
      let outMsg = MessageWrapper.create();
      outMsg.type = type;
      outMsg.payload = messageSerialized;
      return outMsg;
    }
}
