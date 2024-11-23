import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QLTKComponent } from './qltk.component';

describe('QLTKComponent', () => {
  let component: QLTKComponent;
  let fixture: ComponentFixture<QLTKComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QLTKComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QLTKComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
