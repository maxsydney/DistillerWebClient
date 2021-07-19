import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class SocketService {

  private socket: WebSocketSubject<any>;

  connect(url: string): Observable<any> {
    if (!this.socket) {
      console.log('Established connection');
      this.socket = new WebSocketSubject({
        url: url,
        deserializer: ({ data }) => data,
        serializer: ({ data }) => {let a = new Blob([data]); console.log(a); return a}
      });
    }

    return this.socket;
  }

  sendMessage(msg: any): void {
    this.socket.next(msg);
    console.log(msg);
  }
}
