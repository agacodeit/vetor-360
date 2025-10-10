import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitationModal } from './solicitation-modal';

describe('SolicitationModal', () => {
  let component: SolicitationModal;
  let fixture: ComponentFixture<SolicitationModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitationModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitationModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
