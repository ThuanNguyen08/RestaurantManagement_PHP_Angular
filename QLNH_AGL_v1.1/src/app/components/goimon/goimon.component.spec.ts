import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoimonComponent } from './goimon.component';

describe('GoimonComponent', () => {
  let component: GoimonComponent;
  let fixture: ComponentFixture<GoimonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GoimonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoimonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
