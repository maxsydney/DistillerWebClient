import { Injectable } from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import { Observable, Subject} from 'rxjs';

@Injectable()
export class SocketService {

  sock: WebSocket;
  public socket: WebSocketSubject<string>;

  connect(url: string): Observable<string> {
    if (!this.socket) {
      console.log('Connecting to socket');
      this.socket = new WebSocketSubject(url);
    }

    return this.socket;
  }

  sendMessage(msg: string): void {
    this.socket.next(msg);
    console.log(msg);
  }
}
