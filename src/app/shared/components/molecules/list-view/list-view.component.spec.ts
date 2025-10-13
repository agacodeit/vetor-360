import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsListViewComponent } from './list-view.component';

describe('ListViewComponent', () => {
  let component: DsListViewComponent;
  let fixture: ComponentFixture<DsListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DsListViewComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DsListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
