import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckboxComponent } from './checkbox.component';

describe('CheckboxComponent', () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate unique id on init', () => {
    expect(component.uniqueId).toContain('ds-checkbox-');
  });

  it('should toggle value when checkbox is changed', () => {
    const event = { target: { checked: true } };
    component.onCheckboxChange(event);
    expect(component.value).toBe(true);
  });

  it('should emit valueChanged event', (done) => {
    component.valueChanged.subscribe((value) => {
      expect(value).toBe(true);
      done();
    });
    const event = { target: { checked: true } };
    component.onCheckboxChange(event);
  });

  it('should not change value when disabled', () => {
    component.disabled = true;
    component.value = false;
    const event = { target: { checked: true } };
    component.onCheckboxChange(event);
    expect(component.value).toBe(false);
  });

  it('should apply invalid class when invalid is true', () => {
    component.invalid = true;
    expect(component.containerClasses).toContain('invalid');
  });

  it('should show error message when invalid and errorMessage is provided', () => {
    component.invalid = true;
    component.errorMessage = 'This field is required';
    expect(component.showError).toBe(true);
  });

  it('should show helper text when not invalid and helperText is provided', () => {
    component.invalid = false;
    component.helperText = 'Check this option';
    expect(component.showHelper).toBe(true);
  });
});
