import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsBanComponent } from './ds-ban.component';

describe('DsBanComponent', () => {
  let component: DsBanComponent;
  let fixture: ComponentFixture<DsBanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DsBanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DsBanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
