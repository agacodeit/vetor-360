import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SolicitationDetails } from './solicitation-details';
import { ModalService } from '../../../../shared/services/modal/modal.service';
import { ProfileService } from '../../../../shared/services/profile/profile.service';
import { MOCK_COMPLETE_KANBAN_CARD } from '../../../../shared/__mocks__';
import { UserProfile } from '../../../../shared/types/profile.types';

describe('SolicitationDetails', () => {
  let component: SolicitationDetails;
  let fixture: ComponentFixture<SolicitationDetails>;
  let modalService: ModalService;
  let profileService: ProfileService;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitationDetails, HttpClientTestingModule],
      providers: [ModalService, ProfileService]
    })
      .compileComponents();

    modalService = TestBed.inject(ModalService);
    profileService = TestBed.inject(ProfileService);
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

    // client-data component removed from template

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

    // client-data component removed from template
  });

  describe('Profile-based Visibility Rules', () => {
    const mockGestorUser = {
      id: '1',
      email: 'gestor@test.com',
      name: 'Gestor Test',
      userTypeEnum: UserProfile.GESTOR_ACESSEBANK,
      cpfCnpj: '12345678901',
      cellphone: '11999999999',
      comercialPhone: '1133333333',
      userStatusEnum: 'ACTIVE' as const,
      dateHourIncluded: '2023-01-01T00:00:00Z',
      documents: [],
      temporaryPass: false,
      masterAccessGrantedEnum: 'APPROVED' as const,
      notifyClientsByEmail: true,
      authorized: true
    };

    const mockPartnerUser = {
      id: '2',
      email: 'partner@test.com',
      name: 'Partner Test',
      userTypeEnum: UserProfile.PARCEIRO_ACESSEBANK,
      cpfCnpj: '98765432100',
      cellphone: '11888888888',
      comercialPhone: '1144444444',
      userStatusEnum: 'ACTIVE' as const,
      dateHourIncluded: '2023-01-01T00:00:00Z',
      documents: [],
      temporaryPass: false,
      masterAccessGrantedEnum: 'APPROVED' as const,
      notifyClientsByEmail: true,
      authorized: true
    };

    describe('Gestor Profile', () => {
      beforeEach(() => {
        profileService.setCurrentUser(mockGestorUser);
        modalService.open({ id: 'solicitation-details', data: MOCK_COMPLETE_KANBAN_CARD });
        fixture.detectChanges();
      });

      it('should return true for isGestor when user is GESTOR_ACESSEBANK', () => {
        expect(component.isGestor).toBe(true);
      });

      it('should return false for isPartner when user is GESTOR_ACESSEBANK', () => {
        expect(component.isPartner).toBe(false);
      });

      it('should render solicitation-matching component for Gestor when matching tab is active', () => {
        component.activeTabId = 'matching';
        fixture.detectChanges();
        
        const matching = compiled.querySelector('app-solicitation-matching');
        expect(matching).toBeTruthy();
      });

      it('should render credit-operation component for Gestor', () => {
        const creditOperation = compiled.querySelector('app-credit-operation');
        expect(creditOperation).toBeTruthy();
      });

      // financial-summary component removed from template

      it('should render all common components for Gestor when general tab is active', () => {
        component.activeTabId = 'general';
        fixture.detectChanges();
        
        const solicitationData = compiled.querySelector('app-solicitation-data');
        const followUp = compiled.querySelector('app-follow-up');

        expect(solicitationData).toBeTruthy();
        expect(followUp).toBeTruthy();
      });
    });

    describe('Partner Profile', () => {
      beforeEach(() => {
        profileService.setCurrentUser(mockPartnerUser);
        modalService.open({ id: 'solicitation-details', data: MOCK_COMPLETE_KANBAN_CARD });
        fixture.detectChanges();
      });

      it('should return false for isGestor when user is PARCEIRO_ACESSEBANK', () => {
        expect(component.isGestor).toBe(false);
      });

      it('should return true for isPartner when user is PARCEIRO_ACESSEBANK', () => {
        expect(component.isPartner).toBe(true);
      });

      it('should render solicitation-matching component for Partner when matching tab is active', () => {
        component.activeTabId = 'matching';
        fixture.detectChanges();
        
        const matching = compiled.querySelector('app-solicitation-matching');
        expect(matching).toBeTruthy();
      });

      it('should render credit-operation component for Partner when general tab is active (no profile restriction)', () => {
        component.activeTabId = 'general';
        fixture.detectChanges();
        
        const creditOperation = compiled.querySelector('app-credit-operation');
        expect(creditOperation).toBeTruthy();
      });

      // financial-summary component removed from template

      it('should render all common components for Partner when general tab is active', () => {
        component.activeTabId = 'general';
        fixture.detectChanges();
        
        const solicitationData = compiled.querySelector('app-solicitation-data');
        const followUp = compiled.querySelector('app-follow-up');

        expect(solicitationData).toBeTruthy();
        expect(followUp).toBeTruthy();
      });
    });

    describe('No User Profile', () => {
      beforeEach(() => {
        profileService.clearCurrentUser();
        modalService.open({ id: 'solicitation-details', data: MOCK_COMPLETE_KANBAN_CARD });
        fixture.detectChanges();
      });

      it('should return false for isGestor when no user is set', () => {
        expect(component.isGestor).toBe(false);
      });

      it('should return false for isPartner when no user is set', () => {
        expect(component.isPartner).toBe(false);
      });

      it('should render solicitation-matching component when no user is set and matching tab is active', () => {
        component.activeTabId = 'matching';
        fixture.detectChanges();
        
        const matching = compiled.querySelector('app-solicitation-matching');
        expect(matching).toBeTruthy();
      });

      it('should render credit-operation component when no user is set and general tab is active (no profile restriction)', () => {
        component.activeTabId = 'general';
        fixture.detectChanges();
        
        const creditOperation = compiled.querySelector('app-credit-operation');
        expect(creditOperation).toBeTruthy();
      });

      it('should render common components when no user is set and general tab is active', () => {
        component.activeTabId = 'general';
        fixture.detectChanges();
        
        const solicitationData = compiled.querySelector('app-solicitation-data');
        const followUp = compiled.querySelector('app-follow-up');

        expect(solicitationData).toBeTruthy();
        expect(followUp).toBeTruthy();
      });
    });
  });

  describe('Profile Service Integration', () => {
    it('should inject ProfileService', () => {
      expect(profileService).toBeDefined();
    });

    it('should call getCurrentUser from ProfileService', () => {
      const mockGestorUser = {
        id: '1',
        email: 'gestor@test.com',
        name: 'Gestor Test',
        userTypeEnum: UserProfile.GESTOR_ACESSEBANK,
        cpfCnpj: '12345678901',
        cellphone: '11999999999',
        comercialPhone: '1133333333',
        userStatusEnum: 'ACTIVE' as const,
        dateHourIncluded: '2023-01-01T00:00:00Z',
        documents: [],
        temporaryPass: false,
        masterAccessGrantedEnum: 'APPROVED' as const,
        notifyClientsByEmail: true,
        authorized: true
      };

      spyOn(profileService, 'getCurrentUser').and.returnValue(mockGestorUser);

      const isGestor = component.isGestor;

      expect(profileService.getCurrentUser).toHaveBeenCalled();
      expect(isGestor).toBe(true);
    });

    it('should handle null user from ProfileService', () => {
      spyOn(profileService, 'getCurrentUser').and.returnValue(null);

      const isGestor = component.isGestor;
      const isPartner = component.isPartner;

      expect(isGestor).toBe(false);
      expect(isPartner).toBe(false);
    });
  });
});
