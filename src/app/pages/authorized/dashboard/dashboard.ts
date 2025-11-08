import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, effect, inject } from '@angular/core';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent, ModalService, SelectOption, InputComponent, SelectComponent, User, AuthService, ToastService } from '../../../shared';
import { ButtonComponent, CardComponent, IconComponent, KanbanCard, KanbanColumn, KanbanComponent } from '../../../shared/components';
import { OpportunityService, OpportunitySummary, OpportunityStatus } from '../../../shared/services/opportunity/opportunity.service';
import { SolicitationModal } from "./solicitation-modal/solicitation-modal";
import { SolicitationDetails } from "./solicitation-details/solicitation-details";
import { DocumentsModalComponent } from "./solicitation-modal/documents-modal/documents-modal.component";
import { Subject } from 'rxjs';

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
export class Dashboard implements OnInit, OnDestroy {
  private modalService = inject(ModalService);
  private opportunityService = inject(OpportunityService);
  private toastService = inject(ToastService);

  isCreateModalOpen: boolean = false;
  isDetailsModalOpen: boolean = false;
  isDocumentsModalOpen: boolean = false;
  documentsSolicitationData: any = null;

  kanbanColumns: KanbanColumn[] = [];
  private allKanbanColumns: KanbanColumn[] = [];

  private readonly STATUS_CONFIG: Array<{ status: OpportunityStatus; columnId: string; title: string; color: string }> = [
    { status: 'PENDING_DOCUMENTS', columnId: 'pending-documents', title: 'Pendente de documentos', color: '#FF9900' },
    { status: 'IN_ANALYSIS', columnId: 'in-analysis', title: 'Em análise', color: '#FFC800' },
    { status: 'IN_NEGOTIATION', columnId: 'negotiation', title: 'Em negociação', color: '#B700FF' },
    { status: 'WAITING_PAYMENT', columnId: 'waiting-payment', title: 'Aguardando pagamento', color: '#204FFF' },
    { status: 'FUNDS_RELEASED', columnId: 'released-resources', title: 'Recursos liberados', color: '#00B7FF' },
  ];

  private readonly OPERATION_LABELS: Record<string, string> = {
    WORKING_CAPITAL_LONG_TERM: 'Capital de Giro (Longo Prazo)',
    WORKING_CAPITAL_SHORT_TERM: 'Capital de Giro (Curto Prazo)',
    INVOICE_DISCOUNTING: 'Desconto de Duplicatas',
    ANTICIPATION_RECEIVABLES: 'Antecipação de Recebíveis',
    STRUCTURED_REAL_ESTATE_CREDIT: 'Crédito Estruturado Imobiliário'
  };

  // Filters
  filterClientName: string = 'ACME LTDA';
  filterStatus: OpportunityStatus | '' = 'PENDING_DOCUMENTS';
  statusFilterOptions: SelectOption[] = [
    { value: '', label: 'Todos os status' },
    ...this.STATUS_CONFIG.map(config => ({ value: config.status, label: config.title }))
  ];

  isLoadingKanban: boolean = false;
  errorMessage: string | null = null;
  private hasLoadedKanban: boolean = false;

  pagination = {
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true
  };

  get user(): User {
    return this.authService.getCurrentUser();
  }

  private filterDebounceTimer: any = null;

  constructor(private authService: AuthService) {
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
    this.loadOpportunities();
  }

  ngOnDestroy(): void {
    if (this.filterDebounceTimer) {
      clearTimeout(this.filterDebounceTimer);
    }
  }

  private loadOpportunities(page: number = 0): void {
    this.isLoadingKanban = true;
    this.errorMessage = null;
    this.hasLoadedKanban = false;

    const request = {
      page,
      size: this.pagination.size,
      status: this.filterStatus ? this.filterStatus : undefined,
      customerName: this.filterClientName ? this.filterClientName.trim() : undefined,
      userId: this.user.id,
      dataCriacao: "2025-10-01 00:00:00",
    };

    this.opportunityService.searchOpportunities(request).subscribe({
      next: response => {
        this.hasLoadedKanban = true;
        this.pagination = {
          page: response.page,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          first: response.first,
          last: response.last
        };

        this.buildColumnsFromOpportunities(response.content);
        this.isLoadingKanban = false;
      },
      error: error => {
        console.error('Erro ao carregar oportunidades:', error);
        this.hasLoadedKanban = true;
        this.isLoadingKanban = false;
        this.errorMessage = error?.error?.message || 'Não foi possível carregar as oportunidades.';
        this.kanbanColumns = this.createEmptyColumns();
        this.allKanbanColumns = this.kanbanColumns;
      }
    });
  }

  private buildColumnsFromOpportunities(opportunities: OpportunitySummary[]): void {
    const columns = this.createEmptyColumns();

    opportunities.forEach(opportunity => {
      const config = this.STATUS_CONFIG.find(item => item.status === opportunity.status);
      if (!config) {
        return;
      }

      const card = this.mapOpportunityToCard(opportunity);
      const column = columns.find(col => col.id === config.columnId);
      if (column) {
        column.cards.push(card);
      }
    });

    this.allKanbanColumns = columns;
    this.kanbanColumns = columns;
  }

  private createEmptyColumns(): KanbanColumn[] {
    return this.STATUS_CONFIG.map(config => ({
      id: config.columnId,
      title: config.title,
      color: config.color,
      cards: []
    }));
  }

  private mapOpportunityToCard(opportunity: OpportunitySummary): KanbanCard {
    const operationLabel = this.getOperationLabel(opportunity.operation);
    const documentsSummary = this.getDocumentsSummary(opportunity.documents);
    const valueLabel = this.formatCurrency(opportunity.value, opportunity.valueType);
    const createdAt = this.formatDate(opportunity.dateHourIncluded);
    const statusConfig = this.STATUS_CONFIG.find(item => item.status === opportunity.status);
    const statusLabel = statusConfig ? statusConfig.title : opportunity.status;

    return {
      id: opportunity.id,
      title: opportunity.customerName || 'Cliente não informado',
      description: operationLabel,
      client: opportunity.customerName || 'Cliente não informado',
      cnpj: opportunity.id,
      status: opportunity.status,
      tags: [operationLabel],
      data: {
        opportunity,
        operationLabel,
        documentsSummary,
        valueLabel,
        createdAt,
        statusLabel
      }
    };
  }

  private getOperationLabel(operation: string): string {
    return this.OPERATION_LABELS[operation] || operation;
  }

  private getDocumentsSummary(documents: OpportunitySummary['documents']): { completed: number; total: number } {
    if (!documents || documents.length === 0) {
      return { completed: 0, total: 0 };
    }

    const total = documents.length;
    const completed = documents.filter(doc => doc.documentStatusEnum === 'COMPLETED').length;
    return { completed, total };
  }

  private formatCurrency(value: number, currency: string): string {
    if (value === null || value === undefined) {
      return '-';
    }

    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency || 'BRL'
    });

    return formatter.format(value);
  }

  private formatDate(dateTime: string): string {
    if (!dateTime) {
      return '';
    }

    const parsed = new Date(dateTime.replace(' ', 'T'));
    if (isNaN(parsed.getTime())) {
      return dateTime;
    }

    return parsed.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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


  openCreateSolicitationModal() {
    this.isCreateModalOpen = true;
    const closeSubject = this.modalService.open({
      id: "create-solicitation",
      title: "Nova Solicitação",
      subtitle: "Informe os dados do produto e do cliente",
      size: "lg",
      showHeader: true,
      showCloseButton: true,
      closeOnBackdropClick: true,
      closeOnEscapeKey: true,
    });

    closeSubject.subscribe((result: any) => {
      this.onCreateModalClosed(result);
    });
  }

  onModalClosed(result: any) {
    console.log("Modal fechado:", result);
  }

  onCreateModalClosed(result: any) {
    this.isCreateModalOpen = false;
    setTimeout(() => {
      if (result && result.id) {
        this.openDocumentsModal(result);
      }
    }, 300);
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
    return this.pagination.totalElements || this.kanbanColumns.reduce((total, column) => total + column.cards.length, 0);
  }

  get shouldShowEmptyState(): boolean {
    return this.hasLoadedKanban && !this.isLoadingKanban && !this.errorMessage && !this.hasSolicitations;
  }

  get shouldShowKanban(): boolean {
    return !this.isLoadingKanban && !this.errorMessage && this.hasSolicitations;
  }

  /**
   * Limpa todas as solicitações (para teste)
   */
  clearAllSolicitations() {
    this.kanbanColumns = this.createEmptyColumns();
    this.allKanbanColumns = this.kanbanColumns;
    this.pagination = {
      ...this.pagination,
      totalElements: 0
    };
  }

  /**
   * Restaura as solicitações de exemplo (para teste)
   */
  restoreExampleSolicitations() {
    this.loadOpportunities();
  }

  goToPreviousPage(): void {
    if (this.pagination.first || this.isLoadingKanban) {
      return;
    }
    this.loadOpportunities(this.pagination.page - 1);
  }

  goToNextPage(): void {
    if (this.pagination.last || this.isLoadingKanban) {
      return;
    }
    this.loadOpportunities(this.pagination.page + 1);
  }

  async onCardClick(card: KanbanCard) {
    try {
      const opportunity = await this.opportunityService.getOpportunityById(card.id);
      card.data.opportunity = opportunity;

      if (card.status === 'PENDING_DOCUMENTS') {
        const opportunityData = card.data?.opportunity || card;
        const modal = this.openDocumentsModal(opportunityData);
        modal.subscribe(() => {
          this.openDetailsModal(card);
        });
      } else {
        this.openDetailsModal(card);
      }
    } catch (error) {
      console.error('Erro ao carregar oportunidade:', error);
      this.toastService.error('Erro ao carregar oportunidade. Tente novamente.');
    }

  }

  openDetailsModal(card: KanbanCard) {
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

  // Apply filters to columns/cards
  applyFilters() {
    this.pagination.page = 0;

    if (this.filterDebounceTimer) {
      clearTimeout(this.filterDebounceTimer);
    }

    this.filterDebounceTimer = setTimeout(() => {
      this.loadOpportunities(0);
      this.filterDebounceTimer = null;
    }, 500);
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
  openDocumentsModal(solicitationData: any): Subject<any> {
    this.documentsSolicitationData = solicitationData;
    const closeSubject = this.modalService.open({
      id: 'documents-modal',
      title: 'Documentos Necessários',
      subtitle: 'Para completar sua solicitação, envie os documentos necessários.',
      size: 'lg',
      data: {
        solicitationData: solicitationData
      }
    });
    return closeSubject;
  }
}
