import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { KanbanCard } from '../../../shared/components';
import { ModalService } from '../../../shared/services/modal/modal.service';
import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let modalService: ModalService;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard, HttpClientTestingModule],
      providers: [ModalService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    modalService = TestBed.inject(ModalService);
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

    it('should initialize columns with cards', () => {
      const totalCards = component.kanbanColumns.reduce((sum, col) => sum + col.cards.length, 0);
      expect(totalCards).toBeGreaterThan(0);
    });
  });

  describe('Kanban Column Structure', () => {
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
    it('should have cards with required properties', () => {
      const firstCard = component.kanbanColumns[0].cards[0];
      expect(firstCard.id).toBeDefined();
      expect(firstCard.title).toBeDefined();
      expect(firstCard.description).toBeDefined();
      expect(firstCard.priority).toBeDefined();
      expect(firstCard.client).toBeDefined();
      expect(firstCard.cnpj).toBeDefined();
      expect(firstCard.dueDate).toBeDefined();
      expect(firstCard.status).toBeDefined();
    });

    it('should have cards with valid priority values', () => {
      const allCards = component.kanbanColumns.flatMap(col => col.cards);
      const priorities = allCards.map(card => card.priority).filter(p => p !== undefined);
      priorities.forEach(priority => {
        expect(['high', 'medium', 'low']).toContain(priority);
      });
    });

    it('should have cards with valid status matching column id', () => {
      component.kanbanColumns.forEach(column => {
        column.cards.forEach(card => {
          expect(card.status).toBe(column.id);
        });
      });
    });
  });

  describe('Modal Management', () => {
    it('should open create solicitation modal', () => {
      spyOn(modalService, 'open');

      component.openCreateSolicitationModal();

      expect(component.isCreateModalOpen).toBe(true);
      expect(modalService.open).toHaveBeenCalledWith(jasmine.objectContaining({
        id: 'create-solicitation',
        title: 'Nova Solicitação',
        subtitle: 'Informe os dados do produto e do cliente',
        size: 'lg'
      }));
    });

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

    it('should open details modal when card is clicked', () => {
      spyOn(modalService, 'open');
      const testCard: KanbanCard = component.kanbanColumns[0].cards[0];

      component.onCardClick(testCard);

      expect(component.isDetailsModalOpen).toBe(true);
      expect(modalService.open).toHaveBeenCalledWith(jasmine.objectContaining({
        id: 'solicitation-details',
        title: 'Visão geral',
        size: 'fullscreen',
        data: testCard
      }));
    });
  });

  describe('Kanban Event Handlers', () => {
    it('should handle cardMoved event', () => {
      const event = { cardId: '1', fromColumn: 'pending-documents', toColumn: 'in-analysis' };

      expect(() => component.onCardMoved(event)).not.toThrow();
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
        description: 'Fake card',
        status: 'pending-documents'
      };

      expect(() => component.removeCard(fakeCard, 'pending-documents')).not.toThrow();
    });

    it('should not throw error when removing card from non-existent column', () => {
      const card = component.kanbanColumns[0].cards[0];

      expect(() => component.removeCard(card, 'non-existent-column')).not.toThrow();
    });
  });

  describe('Form Configuration', () => {
    it('should initialize form with purpose field', () => {
      expect(component.form).toBeDefined();
      expect(component.form.get('purpose')).toBeDefined();
    });

    it('should have required validator on purpose field', () => {
      const purposeControl = component.form.get('purpose');

      purposeControl?.setValue('');
      expect(purposeControl?.hasError('required')).toBe(true);

      purposeControl?.setValue('Some purpose');
      expect(purposeControl?.hasError('required')).toBe(false);
    });

    it('should have statusOptions configured', () => {
      expect(component.statusOptions).toBeDefined();
      expect(component.statusOptions.length).toBe(3);
      expect(component.statusOptions[0].value).toBe('active');
      expect(component.statusOptions[1].value).toBe('inactive');
      expect(component.statusOptions[2].value).toBe('pending');
    });

    it('should have categoryOptions with groups', () => {
      expect(component.categoryOptions).toBeDefined();
      expect(component.categoryOptions.length).toBe(3);

      const premiumOption = component.categoryOptions.find(opt => opt.value === 'premium');
      expect(premiumOption?.group).toBe('Pagos');

      const freeOption = component.categoryOptions.find(opt => opt.value === 'free');
      expect(freeOption?.group).toBe('Gratuitos');
    });
  });

  describe('Computed Properties', () => {
    it('should return true for hasSolicitations when cards exist', () => {
      expect(component.hasSolicitations).toBe(true);
    });

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
    it('should clear all solicitations', () => {
      component.clearAllSolicitations();

      component.kanbanColumns.forEach(column => {
        expect(column.cards.length).toBe(0);
      });
      expect(component.hasSolicitations).toBe(false);
    });

    it('should restore example solicitations', () => {
      component.clearAllSolicitations();
      expect(component.totalSolicitations).toBe(0);

      component.restoreExampleSolicitations();

      expect(component.totalSolicitations).toBeGreaterThan(0);
      expect(component.hasSolicitations).toBe(true);
    });
  });

  describe('Template Rendering', () => {
    it('should show welcome message when no solicitations exist', () => {
      component.clearAllSolicitations();
      fixture.detectChanges();

      const welcomeMsg = compiled.querySelector('.welcome-msg');
      expect(welcomeMsg).toBeTruthy();
      expect(welcomeMsg?.textContent).toContain('Bem-vindo, Advisor!');
      expect(welcomeMsg?.textContent).toContain('Ainda não há solicitações cadastradas');
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

    it('should render kanban component when solicitations exist', () => {
      component.restoreExampleSolicitations();
      fixture.detectChanges();

      const kanbanComponent = compiled.querySelector('ds-kanban');
      expect(kanbanComponent).toBeTruthy();
    });

    it('should not render kanban component when no solicitations exist', () => {
      component.clearAllSolicitations();
      fixture.detectChanges();

      const kanbanComponent = compiled.querySelector('ds-kanban');
      expect(kanbanComponent).toBeFalsy();
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
    it('should update UI when switching between empty and filled states', () => {
      // Start with data
      component.restoreExampleSolicitations();
      fixture.detectChanges();
      expect(compiled.querySelector('.dashboard')).toBeTruthy();
      expect(compiled.querySelector('.welcome-msg')).toBeFalsy();

      // Clear data
      component.clearAllSolicitations();
      fixture.detectChanges();
      expect(compiled.querySelector('.dashboard')).toBeFalsy();
      expect(compiled.querySelector('.welcome-msg')).toBeTruthy();

      // Restore data
      component.restoreExampleSolicitations();
      fixture.detectChanges();
      expect(compiled.querySelector('.dashboard')).toBeTruthy();
      expect(compiled.querySelector('.welcome-msg')).toBeFalsy();
    });

    it('should maintain data integrity after card removal', () => {
      const initialTotal = component.totalSolicitations;
      const columnId = 'pending-documents';
      const column = component.kanbanColumns.find(col => col.id === columnId);
      const cardToRemove = column?.cards[0];

      if (cardToRemove) {
        component.removeCard(cardToRemove, columnId);

        expect(component.totalSolicitations).toBe(initialTotal - 1);

        // Verify card is actually removed
        const allCards = component.kanbanColumns.flatMap(col => col.cards);
        const removedCard = allCards.find(c => c.id === cardToRemove.id);
        expect(removedCard).toBeUndefined();
      }
    });
  });
});
