import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.css']
})
export class ConsoleComponent {

  @ViewChild('Scrollable') private consoleContainer: ElementRef;
  historyLength: number = 150;
  history: string[] = []

  constructor() { }

  logMessage(message: string): void {
    if (this.history.length >= this.historyLength) {
      this.history.shift();
    }

    const strippedText = message.replace('[0;32mI','').replace('[0m', '');
    this.history.push(strippedText);
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    this.consoleContainer.nativeElement.scroll({
      top: this.consoleContainer.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });               
  }
}
