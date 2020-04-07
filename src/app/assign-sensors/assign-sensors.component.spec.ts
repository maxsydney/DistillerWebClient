import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignSensorsComponent } from './assign-sensors.component';

describe('AssignSensorsComponent', () => {
  let component: AssignSensorsComponent;
  let fixture: ComponentFixture<AssignSensorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignSensorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignSensorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
