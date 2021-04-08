import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SocketService } from './socket.service';
import { ChartsModule } from 'ng2-charts/';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { TuneControllerComponent } from './tune-controller';
import { FormsModule } from '@angular/forms';
import { AssignSensorsComponent } from './assign-sensors/assign-sensors.component';
import { TemperatureChartComponent } from './temperature-chart/temperature-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    TuneControllerComponent,
    AssignSensorsComponent,
    TemperatureChartComponent
  ],
  imports: [
    BrowserModule,
    ChartsModule,
    NgbModule,
    FormsModule
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
