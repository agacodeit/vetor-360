import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent, ModalService, SelectOption, InputComponent, SelectComponent } from '../../../shared';
import { ButtonComponent, CardComponent, IconComponent, KanbanCard, KanbanColumn, KanbanComponent } from '../../../shared/components';
import { SolicitationModal } from "./solicitation-modal/solicitation-modal";
import { SolicitationDetails } from "./solicitation-details/solicitation-details";
import { DocumentsModalComponent } from "./solicitation-modal/documents-modal/documents-modal.component";

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    KanbanComponent,
    CardComponent,
    IconComponent,
    ModalComponent,
    FormsModule,
    ReactiveFormsModule,
    ModalComponent,
    ButtonComponent,
    SolicitationModal,
    SolicitationDetails,
    DocumentsModalComponent,
    InputComponent,
    SelectComponent
  ],
  providers: [
    NgModel
  ],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private modalService = inject(ModalService);
  isCreateModalOpen: boolean = false;
  isDetailsModalOpen: boolean = false;
  isDocumentsModalOpen: boolean = false;
  documentsSolicitationData: any = null;

  kanbanColumns: KanbanColumn[] = [];
  private allKanbanColumns: KanbanColumn[] = [];

  // Filters
  filterClientName: string = '';
  filterStatus: string | null = null;
  statusFilterOptions: SelectOption[] = [];

  constructor() {
    effect(() => {
      const createModalInstance = this.modalService.modals().find(m => m.id === 'create-solicitation');
      this.isCreateModalOpen = createModalInstance ? createModalInstance.isOpen : false;

      const detailsModalInstance = this.modalService.modals().find(m => m.id === 'solicitation-details');
      this.isDetailsModalOpen = detailsModalInstance ? detailsModalInstance.isOpen : false;

      const documentsModalInstance = this.modalService.modals().find(m => m.id === 'documents-modal');
      this.isDocumentsModalOpen = documentsModalInstance ? documentsModalInstance.isOpen : false;

      // Se o modal de documentos foi fechado, limpar os dados
      if (!this.isDocumentsModalOpen) {
        this.documentsSolicitationData = null;
      }
    });
  }

  ngOnInit() {
    this.initializeKanbanData();
  }

  private initializeKanbanData() {
    this.allKanbanColumns = [
      {
        id: 'pending-documents',
        title: 'Pendente de documentos',
        color: '#FF9900',
        cards: [
          {
            id: '1',
            title: 'C76324',
            description: 'Criar sistema de login e registro de usuários',
            priority: 'high',
            client: 'João Silva',
            cnpj: '27.722.892/0001-90',
            dueDate: new Date('2024-02-15'),
            tags: ['backend', 'security'],
            status: 'pending-documents'
          },
          {
            id: '2',
            title: 'C76324',
            description: 'Criar wireframes e mockups para o painel principal',
            priority: 'medium',
            client: 'Maria Santos',
            cnpj: '27.722.892/0001-90',
            dueDate: new Date('2024-02-20'),
            tags: ['design', 'ui/ux'],
            status: 'pending-documents'
          },
          {
            id: '3',
            title: 'C76324',
            description: 'Implementar pipeline de deploy automático',
            priority: 'low',
            client: 'Pedro Costa',
            cnpj: '27.722.892/0001-90',
            dueDate: new Date('2024-02-25'),
            tags: ['devops', 'deployment'],
            status: 'pending-documents'
          }
        ]
      },
      {
        id: 'in-analysis',
        title: 'Em análise',
        color: '#FFC800',
        cards: [
          {
            id: '4',
            title: 'C76324',
            description: 'Criar endpoints para gerenciamento de dados',
            priority: 'high',
            client: 'Ana Oliveira',
            cnpj: '27.722.892/0001-90',
            dueDate: new Date('2024-02-10'),
            tags: ['backend', 'api'],
            status: 'in-analysis'
          },
          {
            id: '5',
            title: 'C76324',
            description: 'Criar cobertura de testes para componentes críticos',
            priority: 'medium',
            client: 'Carlos Lima',
            cnpj: '27.722.892/0001-90',
            dueDate: new Date('2024-02-18'),
            tags: ['testing', 'quality'],
            status: 'in-analysis'
          }
        ]
      },
      {
        id: 'negotiation',
        title: 'Em negociação',
        color: '#B700FF',
        cards: [
          {
            id: '6',
            title: 'C76324',
            description: 'Melhorar estrutura e performance do código existente',
            priority: 'medium',
            client: 'Lucas Ferreira',
            cnpj: '27.722.892/0001-90',
            dueDate: new Date('2024-02-12'),
            tags: ['refactoring', 'performance'],
            status: 'negotiation'
          }
        ]
      },
      {
        id: 'waiting-payment',
        title: 'Aguardando pagamento',
        color: '#204FFF',
        cards: [
          {
            id: '7',
            title: 'C76324',
            description: 'Inicializar estrutura base do projeto com design system',
            priority: 'low',
            client: 'Sofia Alves',
            cnpj: '27.722.892/0001-90',
            dueDate: new Date('2024-01-30'),
            tags: ['setup', 'configuration'],
            status: 'waiting-payment'
          },
          {
            id: '8',
            title: 'C76324',
            description: 'Desenvolver componentes reutilizáveis e documentação',
            priority: 'high',
            client: 'Rafael Mendes',
            cnpj: '27.722.892/0001-90',
            dueDate: new Date('2024-02-05'),
            tags: ['design-system', 'components'],
            status: 'waiting-payment'
          },
          {
            id: 'custom-card-1',
            title: 'C76324',
            description: 'Este card usa template customizado',
            priority: 'medium',
            client: 'Desenvolvedor',
            cnpj: '27.722.892/0001-90',
            dueDate: new Date('2024-02-15'),
            tags: ['custom', 'template'],
            status: 'waiting-payment'
          }
        ]
      },
      {
        id: 'released-resources',
        title: 'Recursos liberados',
        color: '#00B7FF',
        cards: [
          {
            id: '7',
            title: 'C76324',
            description: 'Inicializar estrutura base do projeto com design system',
            priority: 'low',
            client: 'Sofia Alves',
            cnpj: '27.722.892/0001-90',
            dueDate: new Date('2024-01-30'),
            tags: ['setup', 'configuration'],
            status: 'released-resources'
          },
          {
            id: '8',
            title: 'C76324',
            description: 'Desenvolver componentes reutilizáveis e documentação',
            priority: 'high',
            client: 'Rafael Mendes',
            cnpj: '27.722.892/0001-90',
            dueDate: new Date('2024-02-05'),
            tags: ['design-system', 'components'],
            status: 'released-resources'
          },
          {
            id: 'custom-card-1',
            title: 'C76324',
            description: 'Este card usa template customizado',
            priority: 'medium',
            client: 'Desenvolvedor',
            cnpj: '27.722.892/0001-90',
            dueDate: new Date('2024-02-15'),
            tags: ['custom', 'template'],
            status: 'released-resources'
          }
        ]
      }
    ];

    this.buildStatusFilterOptions();
    this.applyFilters();
  }

  onCardMoved(event: any) {

  }

  onCardAdded(event: any) {

  }

  onCardRemoved(event: any) {

  }

  onColumnAdded(event: any) {

  }

  onColumnRemoved(event: any) {

  }

  onColumnRenamed(event: any) {

  }

  removeCard(card: KanbanCard, columnId: string) {
    const column = this.kanbanColumns.find(col => col.id === columnId);
    if (column) {
      const index = column.cards.findIndex(c => c.id === card.id);
      if (index > -1) {
        column.cards.splice(index, 1);
      }
    }
  }


  form: FormGroup = new FormGroup({
    purpose: new FormControl('', Validators.required)
  })

  statusOptions: SelectOption[] = [
    { value: 'active', label: 'Ativo' },
    { value: 'inactive', label: 'Inativo' },
    { value: 'pending', label: 'Pendente' }
  ];

  categoryOptions: SelectOption[] = [
    { value: 'premium', label: 'Premium', group: 'Pagos' },
    { value: 'basic', label: 'Básico', group: 'Pagos' },
    { value: 'free', label: 'Gratuito', group: 'Gratuitos' }
  ];

  openCreateSolicitationModal() {
    this.isCreateModalOpen = true;
    this.modalService.open({
      id: "create-solicitation",
      title: "Nova Solicitação",
      subtitle: "Informe os dados do produto e do cliente",
      size: "lg",
      showHeader: true,
      showCloseButton: true,
      closeOnBackdropClick: true,
      closeOnEscapeKey: true,
    });
  }

  onCreateModalClosed(event: any) {
    this.isCreateModalOpen = false;
  }

  onDetailsModalClosed(event: any) {
    this.isDetailsModalOpen = false;
  }

  /**
   * Verifica se há solicitações (cards) no kanban
   */
  get hasSolicitations(): boolean {
    return this.kanbanColumns.some(column => column.cards.length > 0);
  }

  /**
   * Conta o total de solicitações em todas as colunas
   */
  get totalSolicitations(): number {
    return this.kanbanColumns.reduce((total, column) => total + column.cards.length, 0);
  }

  /**
   * Limpa todas as solicitações (para teste)
   */
  clearAllSolicitations() {
    this.kanbanColumns.forEach(column => {
      column.cards = [];
    });
  }

  /**
   * Restaura as solicitações de exemplo (para teste)
   */
  restoreExampleSolicitations() {
    this.initializeKanbanData();
  }

  onCardClick(card: KanbanCard) {
    this.isDetailsModalOpen = true;
    this.modalService.open({
      id: "solicitation-details",
      title: "Visão geral",
      size: "fullscreen",
      showHeader: true,
      showCloseButton: true,
      closeOnBackdropClick: true,
      closeOnEscapeKey: true,
      data: card
    });
  }

  // Build status options from columns
  private buildStatusFilterOptions() {
    this.statusFilterOptions = this.allKanbanColumns.map(col => ({ value: col.id, label: col.title }));
  }

  // Apply filters to columns/cards
  applyFilters() {
    this.kanbanColumns = this.allKanbanColumns;
  }

  // Métodos para controlar o modal de documentos
  onDocumentsModalClosed(event: any): void {
    this.modalService.close('documents-modal');
    this.documentsSolicitationData = null;
  }

  onDocumentsSubmit(data: any): void {
    console.log('Documentos enviados:', data);
    this.modalService.close('documents-modal');
    this.documentsSolicitationData = null;

    // Aqui você pode adicionar lógica adicional após o envio dos documentos
    // Por exemplo, atualizar o status da solicitação no kanban
  }

  // Método público para abrir o modal de documentos (chamado pelo modal de solicitação)
  openDocumentsModal(solicitationData: any): void {
    this.documentsSolicitationData = solicitationData;
    this.modalService.open({
      id: 'documents-modal',
      title: 'Documentos Necessários',
      subtitle: 'Para completar sua solicitação, envie os documentos necessários.',
      size: 'lg',
      data: {
        solicitationData: solicitationData
      }
    });
  }
}
