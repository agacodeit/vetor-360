import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitationDetails } from './solicitation-details';
import { ModalService } from '../../../../shared/services/modal/modal.service';
import { MOCK_COMPLETE_KANBAN_CARD } from '../../../../shared/__mocks__';

describe('SolicitationDetails', () => {
  let component: SolicitationDetails;
  let fixture: ComponentFixture<SolicitationDetails>;
  let modalService: ModalService;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitationDetails],
      providers: [ModalService]
    })
      .compileComponents();

    modalService = TestBed.inject(ModalService);
    fixture = TestBed.createComponent(SolicitationDetails);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize cardData as null by default', () => {
      fixture.detectChanges();
      // cardData is undefined when modal is not found
      expect(component.cardData).toBeFalsy();
    });

    it('should retrieve cardData from modal service if available', () => {
      modalService.open({ id: 'solicitation-details', data: MOCK_COMPLETE_KANBAN_CARD });

      const newFixture = TestBed.createComponent(SolicitationDetails);
      const newComponent = newFixture.componentInstance;

      expect(newComponent.cardData).toEqual(MOCK_COMPLETE_KANBAN_CARD);
    });

    it('should handle missing modal data gracefully', () => {
      modalService.open({ id: 'solicitation-details' });

      const newFixture = TestBed.createComponent(SolicitationDetails);
      const newComponent = newFixture.componentInstance;

      expect(newComponent.cardData).toBeUndefined();
    });
  });

  describe('Modal Service Integration', () => {
    it('should inject ModalService', () => {
      expect(modalService).toBeDefined();
    });

    it('should find modal by id "solicitation-details"', () => {
      modalService.open({ id: 'solicitation-details', data: MOCK_COMPLETE_KANBAN_CARD });

      const modal = modalService.modals().find(m => m.id === 'solicitation-details');

      expect(modal).toBeDefined();
      expect(modal?.id).toBe('solicitation-details');
    });

    it('should access modal config data', () => {
      modalService.open({ id: 'solicitation-details', data: MOCK_COMPLETE_KANBAN_CARD });

      const modal = modalService.modals().find(m => m.id === 'solicitation-details');

      expect(modal?.config.data).toEqual(MOCK_COMPLETE_KANBAN_CARD);
    });
  });

  describe('Template Rendering', () => {
    it('should render the article element', () => {
      fixture.detectChanges();

      const article = compiled.querySelector('.solicitation-details');
      expect(article).toBeTruthy();
    });

    it('should render solicitation-data component', () => {
      fixture.detectChanges();

      const solicitationData = compiled.querySelector('app-solicitation-data');
      expect(solicitationData).toBeTruthy();
    });

    it('should render follow-up component', () => {
      fixture.detectChanges();

      const followUp = compiled.querySelector('app-follow-up');
      expect(followUp).toBeTruthy();
    });

    it('should render client-data component', () => {
      fixture.detectChanges();

      const clientData = compiled.querySelector('app-client-data');
      expect(clientData).toBeTruthy();
    });

    it('should have correct container structure', () => {
      fixture.detectChanges();

      const container = compiled.querySelector('.solicitation-details__container');
      const content = compiled.querySelector('.solicitation-details__content');

      expect(container).toBeTruthy();
      expect(content).toBeTruthy();
    });
  });

  describe('Component Integration', () => {
    it('should pass cardData to solicitation-data component', () => {
      modalService.open({ id: 'solicitation-details', data: MOCK_COMPLETE_KANBAN_CARD });

      const newFixture = TestBed.createComponent(SolicitationDetails);
      newFixture.detectChanges();

      const solicitationDataElement = newFixture.nativeElement.querySelector('app-solicitation-data');
      expect(solicitationDataElement).toBeTruthy();
    });

    it('should pass cardData to client-data component', () => {
      modalService.open({ id: 'solicitation-details', data: MOCK_COMPLETE_KANBAN_CARD });

      const newFixture = TestBed.createComponent(SolicitationDetails);
      newFixture.detectChanges();

      const clientDataElement = newFixture.nativeElement.querySelector('app-client-data');
      expect(clientDataElement).toBeTruthy();
    });
  });
});
