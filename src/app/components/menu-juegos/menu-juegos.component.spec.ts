import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuJuegosComponent } from './menu-juegos.component';

describe('MenuJuegosComponent', () => {
  let component: MenuJuegosComponent;
  let fixture: ComponentFixture<MenuJuegosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuJuegosComponent]
    });
    fixture = TestBed.createComponent(MenuJuegosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
