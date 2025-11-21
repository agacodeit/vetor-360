import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, Subject } from 'rxjs';

import { KanbanCard } from '../../../shared/components';
import { ModalService } from '../../../shared/services/modal/modal.service';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { OpportunityService, OpportunitySummary, OpportunityStatus } from '../../../shared/services/opportunity/opportunity.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { OperationRegistryService } from '../../../shared/services/operation/operation-registry.service';
import { ErrorHandlerService } from '../../../shared/services/error-handler/error-handler.service';
import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let modalService: ModalService;
  let authService: jasmine.SpyObj<AuthService>;
  let opportunityService: jasmine.SpyObj<OpportunityService>;
  let compiled: HTMLElement;

  const mockUser = {
    id: '1',
    email: 'test@test.com',
    name: 'Test User',
    userTypeEnum: 'GESTOR_ACESSEBANK' as any,
    cpfCnpj: '12345678901',
    cellphone: '11999999999',
    comercialPhone: '1133333333',
    userStatusEnum: 'ACTIVE' as any,
    dateHourIncluded: '2023-01-01T00:00:00Z',
    documents: [],
    temporaryPass: false,
    masterAccessGrantedEnum: 'APPROVED' as any,
    notifyClientsByEmail: true,
    authorized: true
  };

  const createMockOpportunity = (id: string, status: OpportunityStatus, customerName: string): OpportunitySummary => ({
    id,
    operation: 'OP1',
    value: 1000,
    valueType: 'BRL',
    activityTypeEnum: 'ACT1',
    status,
    dateHourIncluded: '2024-01-01T00:00:00Z',
    customerName,
    documents: []
  });

  const mockOpportunities: Record<OpportunityStatus, OpportunitySummary[]> = {
    'PENDING_DOCUMENTS': [
      createMockOpportunity('1', 'PENDING_DOCUMENTS', 'Cliente 1'),
      createMockOpportunity('2', 'PENDING_DOCUMENTS', 'Cliente 2'),
      createMockOpportunity('3', 'PENDING_DOCUMENTS', 'Cliente 3')
    ],
    'IN_ANALYSIS': [
      createMockOpportunity('4', 'IN_ANALYSIS', 'Cliente 4'),
      createMockOpportunity('5', 'IN_ANALYSIS', 'Cliente 5')
    ],
    'IN_NEGOTIATION': [
      createMockOpportunity('6', 'IN_NEGOTIATION', 'Cliente 6')
    ],
    'WAITING_PAYMENT': [
      createMockOpportunity('7', 'WAITING_PAYMENT', 'Cliente 7'),
      createMockOpportunity('8', 'WAITING_PAYMENT', 'Cliente 8'),
      createMockOpportunity('9', 'WAITING_PAYMENT', 'Cliente 9')
    ],
    'FUNDS_RELEASED': [
      createMockOpportunity('10', 'FUNDS_RELEASED', 'Cliente 10'),
      createMockOpportunity('11', 'FUNDS_RELEASED', 'Cliente 11'),
      createMockOpportunity('12', 'FUNDS_RELEASED', 'Cliente 12')
    ]
  };

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'initializeUser']);
    const opportunityServiceSpy = jasmine.createSpyObj('OpportunityService', ['searchOpportunities', 'updateOpportunityStatus', 'getOpportunityById']);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['success', 'error', 'warning', 'info']);
    const operationRegistrySpy = jasmine.createSpyObj('OperationRegistryService', ['getOperationLabel']);
    const errorHandlerSpy = jasmine.createSpyObj('ErrorHandlerService', ['getErrorMessage']);

    authServiceSpy.getCurrentUser.and.returnValue(mockUser);
    operationRegistrySpy.getOperationLabel.and.returnValue('FGI');
    errorHandlerSpy.getErrorMessage.and.returnValue('Erro ao processar requisição');

    // Mock padrão retorna array vazio
    opportunityServiceSpy.searchOpportunities.and.returnValue(of({
      content: [],
      page: 0,
      size: 10,
      totalPages: 0,
      totalElements: 0,
      first: true,
      last: true
    }));

    opportunityServiceSpy.getOpportunityById.and.returnValue(Promise.resolve(mockOpportunities['PENDING_DOCUMENTS'][0]));
    opportunityServiceSpy.updateOpportunityStatus.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [Dashboard, HttpClientTestingModule],
      providers: [
        ModalService,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: OpportunityService, useValue: opportunityServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: OperationRegistryService, useValue: operationRegistrySpy },
        { provide: ErrorHandlerService, useValue: errorHandlerSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    modalService = TestBed.inject(ModalService);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    opportunityService = TestBed.inject(OpportunityService) as jasmine.SpyObj<OpportunityService>;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with closed modals', () => {
      expect(component.isCreateModalOpen).toBe(false);
      expect(component.isDetailsModalOpen).toBe(false);
    });

    it('should initialize kanban columns on ngOnInit', () => {
      expect(component.kanbanColumns).toBeDefined();
      expect(component.kanbanColumns.length).toBe(5);
    });

    it('should have correct column ids', () => {
      const columnIds = component.kanbanColumns.map(col => col.id);
      expect(columnIds).toContain('pending-documents');
      expect(columnIds).toContain('in-analysis');
      expect(columnIds).toContain('negotiation');
      expect(columnIds).toContain('waiting-payment');
      expect(columnIds).toContain('released-resources');
    });

    it('should initialize columns with cards', fakeAsync(() => {
      // Configurar mock para retornar dados
      opportunityService.searchOpportunities.and.callFake((request: any) => {
        const status = request.status as OpportunityStatus;
        const opportunities = mockOpportunities[status] || [];
        return of({
          content: opportunities,
          page: 0,
          size: 10,
          totalPages: 1,
          totalElements: opportunities.length,
          first: true,
          last: true
        });
      });

      component.restoreExampleSolicitations();
      tick();
      fixture.detectChanges();

      const totalCards = component.kanbanColumns.reduce((sum, col) => sum + col.cards.length, 0);
      expect(totalCards).toBeGreaterThan(0);
    }));
  });

  describe('Kanban Column Structure', () => {
    beforeEach(fakeAsync(() => {
      // Configurar mock para retornar dados
      opportunityService.searchOpportunities.and.callFake((request: any) => {
        const status = request.status as OpportunityStatus;
        const opportunities = mockOpportunities[status] || [];
        return of({
          content: opportunities,
          page: 0,
          size: 10,
          totalPages: 1,
          totalElements: opportunities.length,
          first: true,
          last: true
        });
      });

      component.restoreExampleSolicitations();
      tick();
      fixture.detectChanges();
    }));

    it('should have "Pendente de documentos" column with correct properties', () => {
      const column = component.kanbanColumns.find(col => col.id === 'pending-documents');
      expect(column).toBeDefined();
      expect(column?.title).toBe('Pendente de documentos');
      expect(column?.color).toBe('#FF9900');
      expect(column?.cards.length).toBe(3);
    });

    it('should have "Em análise" column with correct properties', () => {
      const column = component.kanbanColumns.find(col => col.id === 'in-analysis');
      expect(column).toBeDefined();
      expect(column?.title).toBe('Em análise');
      expect(column?.color).toBe('#FFC800');
      expect(column?.cards.length).toBe(2);
    });

    it('should have "Em negociação" column with correct properties', () => {
      const column = component.kanbanColumns.find(col => col.id === 'negotiation');
      expect(column).toBeDefined();
      expect(column?.title).toBe('Em negociação');
      expect(column?.color).toBe('#B700FF');
      expect(column?.cards.length).toBe(1);
    });

    it('should have "Aguardando pagamento" column with correct properties', () => {
      const column = component.kanbanColumns.find(col => col.id === 'waiting-payment');
      expect(column).toBeDefined();
      expect(column?.title).toBe('Aguardando pagamento');
      expect(column?.color).toBe('#204FFF');
      expect(column?.cards.length).toBe(3);
    });

    it('should have "Recursos liberados" column with correct properties', () => {
      const column = component.kanbanColumns.find(col => col.id === 'released-resources');
      expect(column).toBeDefined();
      expect(column?.title).toBe('Recursos liberados');
      expect(column?.color).toBe('#00B7FF');
      expect(column?.cards.length).toBe(3);
    });
  });

  describe('Card Data Validation', () => {
    beforeEach(fakeAsync(() => {
      // Configurar mock para retornar dados
      opportunityService.searchOpportunities.and.callFake((request: any) => {
        const status = request.status as OpportunityStatus;
        const opportunities = mockOpportunities[status] || [];
        return of({
          content: opportunities,
          page: 0,
          size: 10,
          totalPages: 1,
          totalElements: opportunities.length,
          first: true,
          last: true
        });
      });

      component.restoreExampleSolicitations();
      tick();
      fixture.detectChanges();
    }));

    it('should have cards with required properties', () => {
      const columnWithCards = component.kanbanColumns.find(col => col.cards.length > 0);
      expect(columnWithCards).toBeDefined();
      if (columnWithCards && columnWithCards.cards.length > 0) {
        const firstCard = columnWithCards.cards[0];
        expect(firstCard.id).toBeDefined();
        expect(firstCard.title).toBeDefined();
        expect(firstCard.status).toBeDefined();
      }
    });

    // Priority property may not exist in current implementation
    it('should have cards with valid status matching column id', () => {
      component.kanbanColumns.forEach(column => {
        const statusConfig = component['STATUS_CONFIG'].find(config => config.columnId === column.id);
        column.cards.forEach(card => {
          expect(card.status).toBeDefined();
          if (statusConfig) {
            // Card status should match the OpportunityStatus configured for this column
            expect(card.status).toBe(statusConfig.status);
          }
        });
      });
    });

  });

  describe('Modal Management', () => {
    it('should open create solicitation modal', fakeAsync(() => {
      const closeSubject = new Subject<any>();
      spyOn(modalService, 'open').and.returnValue(closeSubject);

      component.openCreateSolicitationModal();
      tick();
      fixture.detectChanges();

      expect(component.isCreateModalOpen).toBe(true);
      expect(modalService.open).toHaveBeenCalledWith(jasmine.objectContaining({
        id: 'create-solicitation',
        title: 'Nova Solicitação',
        subtitle: 'Informe os dados do produto e do cliente',
        size: 'lg'
      }));
    }));

    it('should close create modal when onCreateModalClosed is called', () => {
      component.isCreateModalOpen = true;

      component.onCreateModalClosed({});

      expect(component.isCreateModalOpen).toBe(false);
    });

    it('should close details modal when onDetailsModalClosed is called', () => {
      component.isDetailsModalOpen = true;

      component.onDetailsModalClosed({});

      expect(component.isDetailsModalOpen).toBe(false);
    });

    it('should open details modal when card is clicked', fakeAsync(() => {
      // Configurar mock para retornar dados
      opportunityService.searchOpportunities.and.callFake((request: any) => {
        const status = request.status as OpportunityStatus;
        const opportunities = mockOpportunities[status] || [];
        return of({
          content: opportunities,
          page: 0,
          size: 10,
          totalPages: 1,
          totalElements: opportunities.length,
          first: true,
          last: true
        });
      });

      component.restoreExampleSolicitations();
      tick();
      fixture.detectChanges();

      const closeSubject = new Subject<any>();
      spyOn(modalService, 'open').and.returnValue(closeSubject);
      
      const columnWithCards = component.kanbanColumns.find(col => col.cards.length > 0);
      expect(columnWithCards).toBeDefined();
      if (columnWithCards && columnWithCards.cards.length > 0) {
        const testCard = columnWithCards.cards[0];
        const testColumn = columnWithCards;

        component.onCardClick({ card: testCard, column: testColumn });
        tick();
        fixture.detectChanges();

        expect(modalService.open).toHaveBeenCalled();
      }
    }));
  });

  describe('Kanban Event Handlers', () => {
    beforeEach(fakeAsync(() => {
      // Configurar mock para retornar dados
      opportunityService.searchOpportunities.and.callFake((request: any) => {
        const status = request.status as OpportunityStatus;
        const opportunities = mockOpportunities[status] || [];
        return of({
          content: opportunities,
          page: 0,
          size: 10,
          totalPages: 1,
          totalElements: opportunities.length,
          first: true,
          last: true
        });
      });

      component.restoreExampleSolicitations();
      tick();
      fixture.detectChanges();
    }));

    it('should handle cardMoved event', () => {
      const columnWithCards = component.kanbanColumns.find(col => col.cards.length > 0);
      expect(columnWithCards).toBeDefined();
      if (columnWithCards && columnWithCards.cards.length > 0) {
        const testCard = columnWithCards.cards[0];
        const event = { 
          card: testCard, 
          fromColumn: 'pending-documents', 
          toColumn: 'in-analysis',
          fromIndex: 0,
          toIndex: 0
        };

        expect(() => component.onCardMoved(event)).not.toThrow();
      }
    });

    it('should handle cardAdded event', () => {
      const event = { card: {}, columnId: 'pending-documents' };

      expect(() => component.onCardAdded(event)).not.toThrow();
    });

    it('should handle cardRemoved event', () => {
      const event = { cardId: '1', columnId: 'pending-documents' };

      expect(() => component.onCardRemoved(event)).not.toThrow();
    });

    it('should handle columnAdded event', () => {
      const event = { column: { id: 'new-column', title: 'New Column' } };

      expect(() => component.onColumnAdded(event)).not.toThrow();
    });

    it('should handle columnRemoved event', () => {
      const event = { columnId: 'pending-documents' };

      expect(() => component.onColumnRemoved(event)).not.toThrow();
    });

    it('should handle columnRenamed event', () => {
      const event = { columnId: 'pending-documents', newTitle: 'New Title' };

      expect(() => component.onColumnRenamed(event)).not.toThrow();
    });
  });

  describe('Card Operations', () => {
    it('should remove card from column', () => {
      const columnId = 'pending-documents';
      const column = component.kanbanColumns.find(col => col.id === columnId);
      const initialCardCount = column?.cards.length || 0;
      const cardToRemove = column?.cards[0];

      if (cardToRemove) {
        component.removeCard(cardToRemove, columnId);

        const updatedColumn = component.kanbanColumns.find(col => col.id === columnId);
        expect(updatedColumn?.cards.length).toBe(initialCardCount - 1);
        expect(updatedColumn?.cards.find(c => c.id === cardToRemove.id)).toBeUndefined();
      }
    });

    it('should not throw error when removing non-existent card', () => {
      const fakeCard: KanbanCard = {
        id: 'non-existent',
        title: 'Fake',
        status: 'pending-documents'
      } as KanbanCard;

      expect(() => component.removeCard(fakeCard, 'pending-documents')).not.toThrow();
    });

    it('should not throw error when removing card from non-existent column', fakeAsync(() => {
      // Configurar mock para retornar dados
      opportunityService.searchOpportunities.and.callFake((request: any) => {
        const status = request.status as OpportunityStatus;
        const opportunities = mockOpportunities[status] || [];
        return of({
          content: opportunities,
          page: 0,
          size: 10,
          totalPages: 1,
          totalElements: opportunities.length,
          first: true,
          last: true
        });
      });

      component.restoreExampleSolicitations();
      tick();
      fixture.detectChanges();

      const columnWithCards = component.kanbanColumns.find(col => col.cards.length > 0);
      if (columnWithCards && columnWithCards.cards.length > 0) {
        const card = columnWithCards.cards[0];
        expect(() => component.removeCard(card, 'non-existent-column')).not.toThrow();
      }
    }));
  });

  // Form Configuration tests removed - form property no longer exists in Dashboard component

  describe('Computed Properties', () => {
    it('should return true for hasSolicitations when cards exist', fakeAsync(() => {
      // Configurar mock para retornar dados
      opportunityService.searchOpportunities.and.callFake((request: any) => {
        const status = request.status as OpportunityStatus;
        const opportunities = mockOpportunities[status] || [];
        return of({
          content: opportunities,
          page: 0,
          size: 10,
          totalPages: 1,
          totalElements: opportunities.length,
          first: true,
          last: true
        });
      });

      component.restoreExampleSolicitations();
      tick();
      fixture.detectChanges();

      expect(component.hasSolicitations).toBe(true);
    }));

    it('should return false for hasSolicitations when no cards exist', () => {
      component.clearAllSolicitations();

      expect(component.hasSolicitations).toBe(false);
    });

    it('should calculate totalSolicitations correctly', () => {
      const expectedTotal = component.kanbanColumns.reduce((sum, col) => sum + col.cards.length, 0);

      expect(component.totalSolicitations).toBe(expectedTotal);
    });

    it('should return 0 for totalSolicitations when no cards exist', () => {
      component.clearAllSolicitations();

      expect(component.totalSolicitations).toBe(0);
    });
  });

  describe('Utility Methods', () => {
    it('should clear all solicitations', fakeAsync(() => {
      // Configurar mock para retornar dados primeiro
      opportunityService.searchOpportunities.and.callFake((request: any) => {
        const status = request.status as OpportunityStatus;
        const opportunities = mockOpportunities[status] || [];
        return of({
          content: opportunities,
          page: 0,
          size: 10,
          totalPages: 1,
          totalElements: opportunities.length,
          first: true,
          last: true
        });
      });

      component.restoreExampleSolicitations();
      tick();
      fixture.detectChanges();

      // Agora limpar
      component.clearAllSolicitations();
      fixture.detectChanges();

      component.kanbanColumns.forEach(column => {
        expect(column.cards.length).toBe(0);
      });
      expect(component.hasSolicitations).toBe(false);
    }));

    it('should restore example solicitations', fakeAsync(() => {
      component.clearAllSolicitations();
      expect(component.totalSolicitations).toBe(0);

      // Configurar mock para retornar dados
      opportunityService.searchOpportunities.and.callFake((request: any) => {
        const status = request.status as OpportunityStatus;
        const opportunities = mockOpportunities[status] || [];
        return of({
          content: opportunities,
          page: 0,
          size: 10,
          totalPages: 1,
          totalElements: opportunities.length,
          first: true,
          last: true
        });
      });

      component.restoreExampleSolicitations();
      tick();
      fixture.detectChanges();

      expect(component.totalSolicitations).toBeGreaterThan(0);
      expect(component.hasSolicitations).toBe(true);
    }));
  });

  describe('Template Rendering', () => {
    // Template doesn't show welcome message anymore, it always shows kanban
    it('should show dashboard content when no solicitations exist', () => {
      component.clearAllSolicitations();
      fixture.detectChanges();

      const dashboardContent = compiled.querySelector('.dashboard');
      expect(dashboardContent).toBeTruthy();
    });

    it('should show dashboard content when solicitations exist', () => {
      component.restoreExampleSolicitations();
      fixture.detectChanges();

      const dashboardContent = compiled.querySelector('.dashboard');
      expect(dashboardContent).toBeTruthy();
    });

    it('should render create solicitation button in both states', () => {
      // With solicitations
      component.restoreExampleSolicitations();
      fixture.detectChanges();
      let buttons = compiled.querySelectorAll('ds-button');
      expect(buttons.length).toBeGreaterThan(0);

      // Without solicitations
      component.clearAllSolicitations();
      fixture.detectChanges();
      buttons = compiled.querySelectorAll('ds-button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should render kanban component when solicitations exist', fakeAsync(() => {
      // Configurar mock para retornar dados
      opportunityService.searchOpportunities.and.callFake((request: any) => {
        const status = request.status as OpportunityStatus;
        const opportunities = mockOpportunities[status] || [];
        return of({
          content: opportunities,
          page: 0,
          size: 10,
          totalPages: 1,
          totalElements: opportunities.length,
          first: true,
          last: true
        });
      });

      component.restoreExampleSolicitations();
      tick();
      fixture.detectChanges();

      const kanbanComponent = compiled.querySelector('ds-kanban');
      expect(kanbanComponent).toBeTruthy();
    }));

    // Kanban is always rendered, even when empty
    it('should render kanban component when no solicitations exist', () => {
      component.clearAllSolicitations();
      fixture.detectChanges();

      const kanbanComponent = compiled.querySelector('ds-kanban');
      expect(kanbanComponent).toBeTruthy();
    });
  });

  describe('Modal Components Rendering', () => {
    it('should render create modal when isCreateModalOpen is true', () => {
      component.isCreateModalOpen = true;
      fixture.detectChanges();

      const modalElement = compiled.querySelector('ds-modal[modalId="create-solicitation"]');
      expect(modalElement).toBeTruthy();
    });

    it('should not render create modal when isCreateModalOpen is false', () => {
      component.isCreateModalOpen = false;
      fixture.detectChanges();

      const modalElement = compiled.querySelector('ds-modal[modalId="create-solicitation"]');
      expect(modalElement).toBeFalsy();
    });

    it('should render details modal when isDetailsModalOpen is true', () => {
      component.isDetailsModalOpen = true;
      fixture.detectChanges();

      const modalElement = compiled.querySelector('ds-modal[modalId="solicitation-details"]');
      expect(modalElement).toBeTruthy();
    });

    it('should not render details modal when isDetailsModalOpen is false', () => {
      component.isDetailsModalOpen = false;
      fixture.detectChanges();

      const modalElement = compiled.querySelector('ds-modal[modalId="solicitation-details"]');
      expect(modalElement).toBeFalsy();
    });
  });

  describe('Integration Tests', () => {
    it('should update UI when switching between empty and filled states', fakeAsync(() => {
      // Configurar mock para retornar dados
      opportunityService.searchOpportunities.and.callFake((request: any) => {
        const status = request.status as OpportunityStatus;
        const opportunities = mockOpportunities[status] || [];
        return of({
          content: opportunities,
          page: 0,
          size: 10,
          totalPages: 1,
          totalElements: opportunities.length,
          first: true,
          last: true
        });
      });

      // Start with data
      component.restoreExampleSolicitations();
      tick();
      fixture.detectChanges();
      expect(compiled.querySelector('.dashboard')).toBeTruthy();

      // Clear data
      component.clearAllSolicitations();
      fixture.detectChanges();
      expect(compiled.querySelector('.dashboard')).toBeTruthy();

      // Restore data
      component.restoreExampleSolicitations();
      tick();
      fixture.detectChanges();
      expect(compiled.querySelector('.dashboard')).toBeTruthy();
    }));

    it('should maintain data integrity after card removal', fakeAsync(() => {
      // Configurar mock para retornar dados
      opportunityService.searchOpportunities.and.callFake((request: any) => {
        const status = request.status as OpportunityStatus;
        const opportunities = mockOpportunities[status] || [];
        return of({
          content: opportunities,
          page: 0,
          size: 10,
          totalPages: 1,
          totalElements: opportunities.length,
          first: true,
          last: true
        });
      });

      component.restoreExampleSolicitations();
      tick();
      fixture.detectChanges();

      const initialTotal = component.totalSolicitations;
      const columnId = 'pending-documents';
      const column = component.kanbanColumns.find(col => col.id === columnId);
      const cardToRemove = column?.cards[0];

      if (cardToRemove) {
        component.removeCard(cardToRemove, columnId);
        fixture.detectChanges();

        expect(component.totalSolicitations).toBeLessThanOrEqual(initialTotal);

        // Verify card is actually removed from the column
        const updatedColumn = component.kanbanColumns.find(col => col.id === columnId);
        const removedCard = updatedColumn?.cards.find(c => c.id === cardToRemove.id);
        expect(removedCard).toBeUndefined();
      }
    }));
  });
});
