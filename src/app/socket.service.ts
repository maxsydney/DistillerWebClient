import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subject } from 'rxjs';
import { share } from 'rxjs/operators';

export interface SocketObservable {
  obs: Observable<any>;
  success: boolean;
}
@Injectable()
export class SocketService {

  private socket: WebSocket;
  private obs: Observable<any>;

  // Create websocket connection to PB hardware and
  // return multicast observable to data stream
  connect(url: string): Observable<any> {
    this.socket = new WebSocket(url);      

    this.obs = new Observable(
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
    ).pipe(share());

    return this.obs;
  }

  // Attempt to get websocket observable. If success is false, 
  // obs should not be used
  getConnection(): SocketObservable {
    if (this.socket.readyState == WebSocket.OPEN) {
      return {obs: this.obs, success: true};
    } else {
      console.log("Websocket connection was not open");
      return {obs: this.obs, success: false};
    }
  }

  // Send message over websocket
  sendMessage(msg: any): void {
    if (this.socket.readyState == WebSocket.OPEN) {
      this.socket.send(msg);
    } else {
      console.log("Failed to send message. Socket was closed, closing or connecting");
    }
  }
}
