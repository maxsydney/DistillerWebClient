import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subject } from 'rxjs';
import * as io from "socket.io-client";

@Injectable()
export class SocketService {

  private io_socket;
  private socket: WebSocketSubject<any>;

  connect(url: string): Observable<any> {
    this.io_socket = io(url)
    if (!this.socket) {
      console.log('Established connection');
      this.socket = new WebSocketSubject({
        url: url,
        deserializer: ({ data }) => data,
        serializer: ({ data }) => data
      });
      
    }

    return this.socket;
  }

  sendMessage(msg: any): void {
    // this.socket.next(msg);
    this.io_socket.emit("hello", "world");
    console.log(msg);
  }
}
