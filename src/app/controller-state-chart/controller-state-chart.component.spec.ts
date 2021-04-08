import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerStateChartComponent } from './controller-state-chart.component';

describe('ControllerStateChartComponent', () => {
  let component: ControllerStateChartComponent;
  let fixture: ComponentFixture<ControllerStateChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControllerStateChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControllerStateChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
