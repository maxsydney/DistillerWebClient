import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SocketService } from './socket.service';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { TuneControllerComponent } from './tune-controller';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    TuneControllerComponent
  ],
  imports: [
    BrowserModule,
    ChartsModule,
    NgbModule.forRoot(),
    FormsModule
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
