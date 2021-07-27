import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subject } from 'rxjs';
@Injectable()
export class SocketService {

  private socket: WebSocket;

  connect(url: string): Observable<any> {

    console.log('Established connection');
    this.socket = new WebSocket(url);      

    return new Observable(
      observer => {
        this.socket.onmessage = (event) => {
          observer.next(event.data);
        }

        this.socket.onerror = (event) => {
          observer.error(event);
        }

        this.socket.onclose = (event) => {
          observer.complete();
        }

        return () => {
          this.socket.close(1000, "The user disconnected");
        }
      }
    );
  }

  sendMessage(msg: any): void {
    if (this.socket.readyState == WebSocket.OPEN) {
      this.socket.send(msg);
    } else {
      console.log("Failed to send message. Socket was closed, closing or connecting");
    }
  }
}
