import { Injectable } from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import { Observable, Subject} from 'rxjs';

@Injectable()
export class SocketService {

  sock: WebSocket;
  private socket: WebSocketSubject<JSON>;

  connect(url: string): Observable<JSON> {
    if (!this.socket) {
      console.log('Connecting to socket');
      this.socket = new WebSocketSubject(url);
    }

    return this.socket;
  }

  sendMessage(msg: any): void {
    this.socket.next(msg);
    console.log(msg);
  }
}
