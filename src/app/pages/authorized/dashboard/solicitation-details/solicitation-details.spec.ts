import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitationDetails } from './solicitation-details';

describe('SolicitationDetails', () => {
  let component: SolicitationDetails;
  let fixture: ComponentFixture<SolicitationDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitationDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitationDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
