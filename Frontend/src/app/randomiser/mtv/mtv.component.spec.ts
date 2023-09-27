import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtvComponent } from './mtv.component';

describe('FortniteComponent', () => {
  let component: MtvComponent;
  let fixture: ComponentFixture<MtvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MtvComponent]
    });
    fixture = TestBed.createComponent(MtvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
