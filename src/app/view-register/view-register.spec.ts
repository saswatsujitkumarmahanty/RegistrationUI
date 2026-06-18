import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRegister } from './view-register';

describe('ViewRegister', () => {
  let component: ViewRegister;
  let fixture: ComponentFixture<ViewRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRegister],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewRegister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
