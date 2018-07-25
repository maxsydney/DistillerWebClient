import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class SocketService {

  sock: WebSocket;

  createSocket(url: string): Observable<string> {
    this.sock = new WebSocket(url);

    return new Observable(observer => {
      this.sock.onmessage = (event) => observer.next(event.data);
      this.sock.onerror = (event) => observer.error(event);
      this.sock.onclose = (event) => observer.complete();
    });
  }

  sendMessage(message: any): void {
    this.sock.send(message);
  }
}
