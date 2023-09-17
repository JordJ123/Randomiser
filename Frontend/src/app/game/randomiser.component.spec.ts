import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomiserComponent } from './randomiser.component';

describe('FortniteComponent', () => {
  let component: RandomiserComponent;
  let fixture: ComponentFixture<RandomiserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RandomiserComponent]
    });
    fixture = TestBed.createComponent(RandomiserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
