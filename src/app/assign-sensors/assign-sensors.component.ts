import { Component } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable} from 'rxjs';
import { SocketService } from '../socket.service';
import { SensorManagerCommandMessage, DeviceData, SensorManagerCmdType } from '../ProtoBuf/SensorManagerMessaging'
import { DS18B20Sensor } from '../ProtoBuf/DS18B20Messaging'
import { MessageWrapper, PBMessageType } from '../ProtoBuf/MessageBase';

@Component({
  selector: 'app-assign-sensors',
  templateUrl: './assign-sensors.component.html',
  styleUrls: ['./assign-sensors.component.css']
})
export class AssignSensorsComponent{

  modalReference: NgbModalRef;
  private conn: Observable<string>;
  subscription: any;
  taskStr: string;
  selectStr: string;
  selectedSensor: DS18B20Sensor;
  availableSensors: DeviceData;
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
      this.conn = this.socketService.connect('ws://192.168.1.202:80/ws'); // Sort this out
      this.startSensorAssignTask();
      // this.intervalID = setInterval(this.requestAvailableSensors.bind(this), 2000);
      
      this.subscription = this.conn.subscribe(
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
      
      switch(wrapped.type) {
        case PBMessageType.DeviceData: {
          this.availableSensors = DeviceData.fromBinary(wrapped.payload);
          console.log("Got device data message");
          console.log(this.availableSensors);
          break;
        }
        default: {
          console.log("Assign sensor component can only process device data messages")
        }
      }
    }

    startSensorAssignTask(): void {
      // this.taskStr = 'Assign to';
      // this.selectStr = 'Select sensor';
      // this.selectedSensor.addr = [];
      // this.selectedSensor.task = -1;
      this.requestAvailableSensors();
    }

    requestAvailableSensors(): void {
      const msg = SensorManagerCommandMessage.create();
      msg.cmdType = SensorManagerCmdType.CMD_BROADCAST_SENSORS;

      let wrapped: MessageWrapper = this.wrapMessage(SensorManagerCommandMessage.toBinary(msg), PBMessageType.SensorManagerCommand);
      this.socketService.sendMessage(MessageWrapper.toBinary(wrapped));
      this.socketService.sendMessage(msg);
    }

    // processSensors(data: any): void {
    //   // Clear the array
    //   this.availableSensors.length = 0;

    //   // Write available sensors to array
    //   data['sensors'].forEach(element => {
    //     let t = new TempSensor();
    //     t.fromJSON(element);
    //     this.availableSensors.push(t);
    //   });
    // }

    toHexString(byteArray) {
      return byteArray.reduce((output, elem) =>
        (output + ('0' + elem.toString(16)).slice(-2)),
        '');
    }

    selectSensor(sensor: TempSensor): void {
      this.selectedSensor = sensor;
      this.selectStr = this.toHexString(sensor.addr);
    }

    selectTask(i: number): void {
      console.log(`Selected task is: ${this.tasks[i]}`);
      this.taskStr = this.tasks[i];
      this.selectedSensor.task = i;
    }

    sendAssignSensorMsg(): void {
      const msg = new SensorAssignMsg;
      msg.update(this.selectedSensor);
      this.socketService.sendMessage(msg);
      clearInterval(this.intervalID);
      this.modalReference.close();
    }

    wrapMessage(messageSerialized: Uint8Array, type: PBMessageType): MessageWrapper {
      // TODO: How to specify base interface type as type
      let outMsg = MessageWrapper.create();
      outMsg.type = type;
      outMsg.payload = messageSerialized;
      return outMsg;
    }
}
