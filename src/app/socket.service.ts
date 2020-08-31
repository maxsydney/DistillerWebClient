import { Injectable } from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import { Observable, Subject} from 'rxjs';

@Injectable()
export class SocketService {

  sock: WebSocket;
  private socket: WebSocketSubject<any>;

  connect(url: string): Observable<any> {
    if (!this.socket) {
      console.log('Established connection');
      this.socket = new WebSocketSubject(url);
    }

    return this.socket;
  }

  sendMessage(msg: any): void {
    this.socket.next(msg);
    console.log(msg);
  }
}
