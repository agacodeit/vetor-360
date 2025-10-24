import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { SelectComponent } from './select.component';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;
  let compiled: HTMLElement;

  const mockOptions = [
    { id: 1, label: 'Option 1', value: 'option1' },
    { id: 2, label: 'Option 2', value: 'option2' },
    { id: 3, label: 'Option 3', value: 'option3' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponent, FormsModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    component.options = mockOptions;
    component.optionLabel = 'label';
    component.optionValue = 'value';
    compiled = fixture.nativeElement;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have unique ID generated', () => {
      expect(component.uniqueId).toBeDefined();
      expect(component.uniqueId).toMatch(/^select-\d+$/);
    });

    it('should initialize with default values', () => {
      expect(component.isOpen).toBe(false);
      expect(component.hasValue).toBe(false);
      expect(component.selectedOptions).toEqual([]);
      expect(component.filteredOptions).toEqual(mockOptions);
    });
  });

  describe('Accessibility Features', () => {
    beforeEach(() => {
      component.label = 'Test Label';
      fixture.detectChanges();
    });

    it('should have proper label association', () => {
      const label = compiled.querySelector('label');
      const selectDiv = compiled.querySelector('.select-container > div');

      expect(label).toBeTruthy();
      expect(label?.getAttribute('id')).toBe(`${component.uniqueId}-label`);
      expect(selectDiv?.getAttribute('aria-labelledby')).toBe(`${component.uniqueId}-label`);
    });

    it('should have proper ARIA attributes on main select div', () => {
      const selectDiv = compiled.querySelector('.select-container > div');

      expect(selectDiv?.getAttribute('role')).toBe('combobox');
      expect(selectDiv?.getAttribute('aria-expanded')).toBe('false');
      expect(selectDiv?.getAttribute('aria-haspopup')).toBe('listbox');
    });

    it('should update aria-expanded when dropdown opens', () => {
      const selectDiv = compiled.querySelector('.select-container > div');

      component.toggleDropdown();
      fixture.detectChanges();

      expect(selectDiv?.getAttribute('aria-expanded')).toBe('true');
    });

    it('should have proper ARIA attributes on dropdown', () => {
      component.toggleDropdown();
      fixture.detectChanges();

      const dropdown = compiled.querySelector('.dropdown');
      expect(dropdown?.getAttribute('role')).toBe('listbox');
      expect(dropdown?.getAttribute('aria-labelledby')).toBe(`${component.uniqueId}-label`);
    });

    it('should have proper ARIA attributes on options', () => {
      component.toggleDropdown();
      fixture.detectChanges();

      const options = compiled.querySelectorAll('.option-item');
      options.forEach((option, index) => {
        expect(option.getAttribute('role')).toBe('option');
        expect(option.getAttribute('aria-selected')).toBe('false');
        expect(option.getAttribute('aria-disabled')).toBe('false');
      });
    });

    it('should update aria-selected when option is selected', () => {
      component.toggleDropdown();
      fixture.detectChanges();

      const firstOption = compiled.querySelector('.option-item') as HTMLElement;
      firstOption.click();
      fixture.detectChanges();

      expect(firstOption.getAttribute('aria-selected')).toBe('true');
    });

    it('should handle disabled options with proper ARIA attributes', () => {
      const disabledOptions = [
        { id: 1, label: 'Option 1', value: 'option1', disabled: true },
        { id: 2, label: 'Option 2', value: 'option2', disabled: false }
      ];

      component.options = disabledOptions;
      component.toggleDropdown();
      fixture.detectChanges();

      const options = compiled.querySelectorAll('.option-item');
      expect(options[0].getAttribute('aria-disabled')).toBe('true');
      expect(options[1].getAttribute('aria-disabled')).toBe('false');
    });
  });

  describe('Keyboard Navigation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should toggle dropdown on Enter key', () => {
      const selectDiv = compiled.querySelector('.select-container > div') as HTMLElement;

      selectDiv.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      fixture.detectChanges();

      expect(component.isOpen).toBe(true);
    });

    it('should toggle dropdown on Space key', () => {
      const selectDiv = compiled.querySelector('.select-container > div') as HTMLElement;

      selectDiv.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      fixture.detectChanges();

      expect(component.isOpen).toBe(true);
    });

    it('should close dropdown on Escape key', () => {
      component.toggleDropdown();
      fixture.detectChanges();

      const selectDiv = compiled.querySelector('.select-container > div') as HTMLElement;
      selectDiv.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      fixture.detectChanges();

      expect(component.isOpen).toBe(false);
    });
  });

  describe('Template Rendering', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should render label when provided', () => {
      component.label = 'Test Label';
      fixture.detectChanges();

      const label = compiled.querySelector('label');
      expect(label?.textContent).toBe('Test Label');
    });

    it('should not render label when not provided', () => {
      component.label = '';
      fixture.detectChanges();

      const label = compiled.querySelector('label');
      expect(label).toBeFalsy();
    });

    it('should render placeholder when no value is selected', () => {
      component.placeholder = 'Select an option';
      fixture.detectChanges();

      const displayText = compiled.querySelector('.select-display-text');
      expect(displayText?.textContent).toBe('Select an option');
    });

    it('should render selected value when option is selected', () => {
      component.selectOption(mockOptions[0]);
      fixture.detectChanges();

      const displayText = compiled.querySelector('.select-display-text');
      expect(displayText?.textContent).toBe('Option 1');
    });

    it('should render dropdown arrow', () => {
      const arrow = compiled.querySelector('.dropdown-arrow');
      expect(arrow).toBeTruthy();
    });

    it('should rotate arrow when dropdown is open', () => {
      component.toggleDropdown();
      fixture.detectChanges();

      const arrow = compiled.querySelector('.dropdown-arrow');
      expect(arrow?.classList.contains('rotated')).toBe(true);
    });
  });

  describe('Option Selection', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should select option when clicked', () => {
      component.toggleDropdown();
      fixture.detectChanges();

      const firstOption = compiled.querySelector('.option-item') as HTMLElement;
      firstOption.click();

      expect(component.selectedOptions).toContain(mockOptions[0]);
      expect(component.hasValue).toBe(true);
    });

    it('should close dropdown after selection', () => {
      component.toggleDropdown();
      fixture.detectChanges();

      const firstOption = compiled.querySelector('.option-item') as HTMLElement;
      firstOption.click();

      expect(component.isOpen).toBe(false);
    });

    it('should handle multiple selection when enabled', () => {
      component.multiple = true;
      component.toggleDropdown();
      fixture.detectChanges();

      const firstOption = compiled.querySelector('.option-item') as HTMLElement;
      const secondOption = compiled.querySelectorAll('.option-item')[1] as HTMLElement;

      firstOption.click();
      secondOption.click();

      expect(component.selectedOptions.length).toBe(2);
    });
  });

  describe('Search Functionality', () => {
    beforeEach(() => {
      component.searchable = true;
      fixture.detectChanges();
    });

    it('should render search input when searchable is true', () => {
      component.toggleDropdown();
      fixture.detectChanges();

      const searchInput = compiled.querySelector('.search-input');
      expect(searchInput).toBeTruthy();
    });

    it('should filter options based on search term', () => {
      component.toggleDropdown();
      fixture.detectChanges();

      const searchInput = compiled.querySelector('.search-input') as HTMLInputElement;
      searchInput.value = 'Option 1';
      searchInput.dispatchEvent(new Event('input'));

      expect(component.filteredOptions.length).toBe(1);
      expect(component.filteredOptions[0]['label']).toBe('Option 1');
    });
  });

  describe('Clear Functionality', () => {
    beforeEach(() => {
      component.clearable = true;
      component.selectOption(mockOptions[0]);
      fixture.detectChanges();
    });

    it('should render clear button when clearable and has value', () => {
      const clearButton = compiled.querySelector('.clear-button');
      expect(clearButton).toBeTruthy();
    });

    it('should clear selection when clear button is clicked', () => {
      const clearButton = compiled.querySelector('.clear-button') as HTMLElement;
      clearButton.click();

      expect(component.selectedOptions).toEqual([]);
      expect(component.hasValue).toBe(false);
    });
  });

  describe('Disabled State', () => {
    beforeEach(() => {
      component.disabled = true;
      fixture.detectChanges();
    });

    it('should not be focusable when disabled', () => {
      const selectDiv = compiled.querySelector('.select-container > div') as HTMLElement;
      expect(selectDiv.getAttribute('tabindex')).toBe('-1');
    });

    it('should not open dropdown when disabled', () => {
      const selectDiv = compiled.querySelector('.select-container > div') as HTMLElement;
      selectDiv.click();

      expect(component.isOpen).toBe(false);
    });
  });
});
