import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiaodiengoimonComponent } from './giaodiengoimon.component';

describe('GiaodiengoimonComponent', () => {
  let component: GiaodiengoimonComponent;
  let fixture: ComponentFixture<GiaodiengoimonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GiaodiengoimonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GiaodiengoimonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
