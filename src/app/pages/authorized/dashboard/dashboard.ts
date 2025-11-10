import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, effect, inject } from '@angular/core';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent, ModalService, SelectOption, InputComponent, SelectComponent, User, AuthService, ToastService } from '../../../shared';
import { ButtonComponent, CardComponent, IconComponent, KanbanCard, KanbanColumn, KanbanComponent } from '../../../shared/components';
import { OpportunityService, OpportunitySummary, OpportunityStatus, OpportunitySearchResponse } from '../../../shared/services/opportunity/opportunity.service';
import { SolicitationModal } from "./solicitation-modal/solicitation-modal";
import { SolicitationDetails } from "./solicitation-details/solicitation-details";
import { DocumentsModalComponent } from "./solicitation-modal/documents-modal/documents-modal.component";
import { Subject, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

type ColumnPaginationState = {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

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
  columnsLoading: string[] = [];
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
  filterClientName: string = '';
  filterStatus: OpportunityStatus | '' = '';
  statusFilterOptions: SelectOption[] = [
    { value: '', label: 'Todos os status' },
    ...this.STATUS_CONFIG.map(config => ({ value: config.status, label: config.title }))
  ];

  isLoadingKanban: boolean = false;
  errorMessage: string | null = null;
  private hasLoadedKanban: boolean = false;

  private readonly DEFAULT_PAGE_SIZE = 10;

  columnPagination: Record<OpportunityStatus, ColumnPaginationState> = this.initializeColumnPagination();
  private columnOpportunities: Record<OpportunityStatus, OpportunitySummary[]> = this.initializeColumnOpportunities();

  get user(): User {
    return this.authService.getCurrentUser();
  }

  get hasFiltersApplied(): boolean {
    return !!this.filterClientName?.trim() || !!this.filterStatus;
  }

  private initializeColumnPagination(): Record<OpportunityStatus, ColumnPaginationState> {
    return this.STATUS_CONFIG.reduce((acc, config) => {
      acc[config.status] = this.createPaginationState();
      return acc;
    }, {} as Record<OpportunityStatus, ColumnPaginationState>);
  }

  private initializeColumnOpportunities(): Record<OpportunityStatus, OpportunitySummary[]> {
    return this.STATUS_CONFIG.reduce((acc, config) => {
      acc[config.status] = [];
      return acc;
    }, {} as Record<OpportunityStatus, OpportunitySummary[]>);
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
    this.refreshKanbanColumns();
    this.loadOpportunities();
  }

  ngOnDestroy(): void {
    if (this.filterDebounceTimer) {
      clearTimeout(this.filterDebounceTimer);
    }
  }

  private loadOpportunities(): void {
    this.isLoadingKanban = true;
    this.errorMessage = null;
    this.hasLoadedKanban = false;

    const statusesToLoad = this.getStatusesToLoad();

    if (statusesToLoad.length === 0) {
      this.resetAllColumns();
      this.isLoadingKanban = false;
      this.hasLoadedKanban = true;
      return;
    }

    this.columnsLoading = statusesToLoad
      .map(status => this.getColumnIdByStatus(status))
      .filter((columnId): columnId is string => !!columnId);

    const requests = statusesToLoad.map(status => {
      const pagination = this.columnPagination[status] ?? this.createPaginationState();
      const requestPayload = this.buildOpportunitySearchRequest(status, pagination.page, pagination.size);

      return this.opportunityService.searchOpportunities(requestPayload).pipe(
        map(response => ({ status, response }))
      );
    });

    forkJoin(requests).subscribe({
      next: results => {
        results.forEach(({ status, response }) => {
          this.updateColumnFromResponse(status, response);
        });

        this.resetUnloadedStatuses(statusesToLoad);
        this.refreshKanbanColumns();

        this.hasLoadedKanban = true;
        this.isLoadingKanban = false;
        this.errorMessage = null;
        this.columnsLoading = [];
      },
      error: error => {
        console.error('Erro ao carregar oportunidades:', error);
        this.hasLoadedKanban = true;
        this.isLoadingKanban = false;
        this.errorMessage = error?.error?.message || 'Não foi possível carregar as oportunidades.';
        this.resetAllColumns();
      }
    });
  }

  private getStatusesToLoad(): OpportunityStatus[] {
    if (this.filterStatus) {
      return [this.filterStatus];
    }

    return this.STATUS_CONFIG.map(config => config.status);
  }

  private createPaginationState(overrides: Partial<ColumnPaginationState> = {}): ColumnPaginationState {
    return {
      page: 0,
      size: this.DEFAULT_PAGE_SIZE,
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: true,
      ...overrides
    };
  }

  private buildOpportunitySearchRequest(status: OpportunityStatus, page: number, size: number) {
    return {
      page,
      size,
      status,
      customerName: this.filterClientName ? this.filterClientName.trim() : undefined,
      userId: this.user.id
    };
  }

  private updateColumnFromResponse(status: OpportunityStatus, response: OpportunitySearchResponse): void {
    this.columnPagination[status] = {
      page: response.page,
      size: response.size,
      totalElements: response.totalElements,
      totalPages: response.totalPages,
      first: response.first,
      last: response.last
    };

    const existing = this.columnOpportunities[status] ?? [];
    const shouldAppend = response.page > 0 && existing.length > 0;
    const newContent = response.content ?? [];

    this.columnOpportunities[status] = shouldAppend ? [...existing, ...newContent] : newContent;
  }

  private resetUnloadedStatuses(loadedStatuses: OpportunityStatus[]): void {
    this.STATUS_CONFIG.forEach(config => {
      if (!loadedStatuses.includes(config.status)) {
        const currentSize = this.columnPagination[config.status]?.size ?? this.DEFAULT_PAGE_SIZE;
        this.columnPagination[config.status] = this.createPaginationState({ size: currentSize });
        this.columnOpportunities[config.status] = [];
      }
    });
  }

  private refreshKanbanColumns(): void {
    const columns = this.STATUS_CONFIG.map(config => ({
      id: config.columnId,
      title: config.title,
      color: config.color,
      cards: (this.columnOpportunities[config.status] || []).map(opportunity => this.mapOpportunityToCard(opportunity)),
      pagination: this.columnPagination[config.status]
    }));

    this.allKanbanColumns = columns;
    this.kanbanColumns = columns;
  }

  private resetAllColumns(): void {
    this.columnPagination = this.initializeColumnPagination();
    this.columnOpportunities = this.initializeColumnOpportunities();
    this.refreshKanbanColumns();
    this.columnsLoading = [];
  }

  private getColumnIdByStatus(status: OpportunityStatus): string | undefined {
    const config = this.STATUS_CONFIG.find(item => item.status === status);
    return config?.columnId;
  }

  private getStatusByColumnId(columnId: string): OpportunityStatus | undefined {
    const config = this.STATUS_CONFIG.find(item => item.columnId === columnId);
    return config?.status;
  }

  private addColumnLoading(columnId: string): void {
    if (!this.columnsLoading.includes(columnId)) {
      this.columnsLoading = [...this.columnsLoading, columnId];
    }
  }

  private removeColumnLoading(columnId: string): void {
    this.columnsLoading = this.columnsLoading.filter(id => id !== columnId);
  }

  private loadColumnOpportunities(status: OpportunityStatus, page: number): void {
    const columnId = this.getColumnIdByStatus(status);
    if (!columnId) {
      return;
    }

    const currentPagination = this.columnPagination[status] ?? this.createPaginationState();
    if (currentPagination.last && page > currentPagination.page) {
      return;
    }

    const previousPagination = { ...currentPagination };

    this.addColumnLoading(columnId);
    this.errorMessage = null;

    const requestPayload = this.buildOpportunitySearchRequest(status, page, currentPagination.size);

    this.opportunityService.searchOpportunities(requestPayload).subscribe({
      next: response => {
        this.updateColumnFromResponse(status, response);
        this.refreshKanbanColumns();
        this.removeColumnLoading(columnId);
        this.hasLoadedKanban = true;
      },
      error: error => {
        console.error(`Erro ao carregar oportunidades para a coluna ${columnId}:`, error);
        this.removeColumnLoading(columnId);
        this.errorMessage = error?.error?.message || 'Não foi possível carregar as oportunidades.';
        this.columnPagination[status] = previousPagination;
      }
    });
  }

  private resetPaginationForAllColumns(): void {
    this.STATUS_CONFIG.forEach(config => {
      const current = this.columnPagination[config.status] ?? this.createPaginationState();
      this.columnPagination[config.status] = this.createPaginationState({
        size: current.size
      });
    });
  }

  private createEmptyColumns(): KanbanColumn[] {
    return this.STATUS_CONFIG.map(config => ({
      id: config.columnId,
      title: config.title,
      color: config.color,
      cards: [],
      pagination: this.columnPagination[config.status] ?? this.createPaginationState()
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

  onColumnLoadMore(columnId: string): void {
    const status = this.getStatusByColumnId(columnId);
    if (!status) {
      return;
    }

    if (this.columnsLoading.includes(columnId)) {
      return;
    }

    const pagination = this.columnPagination[status] ?? this.createPaginationState();
    if (pagination.last) {
      return;
    }

    const nextPage = pagination.page + 1;
    this.loadColumnOpportunities(status, nextPage);
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
    const totalFromPagination = Object.values(this.columnPagination || {}).reduce((total, pagination) => {
      return total + (pagination?.totalElements || 0);
    }, 0);

    if (totalFromPagination > 0) {
      return totalFromPagination;
    }

    return this.kanbanColumns.reduce((total, column) => total + column.cards.length, 0);
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
    this.STATUS_CONFIG.forEach(config => {
      const currentSize = this.columnPagination[config.status]?.size ?? this.DEFAULT_PAGE_SIZE;
      this.columnPagination[config.status] = this.createPaginationState({ size: currentSize });
      this.columnOpportunities[config.status] = [];
    });

    this.refreshKanbanColumns();
  }

  /**
   * Restaura as solicitações de exemplo (para teste)
   */
  restoreExampleSolicitations() {
    this.loadOpportunities();
  }

  async onCardClick(event: { card: KanbanCard; column: KanbanColumn }) {
    const { card, column } = event;
    const columnId = column.id;

    if (!this.columnsLoading.includes(columnId)) {
      this.columnsLoading = [...this.columnsLoading, columnId];
    }

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
    } finally {
      this.columnsLoading = this.columnsLoading.filter(id => id !== columnId);
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
    this.resetPaginationForAllColumns();

    if (this.filterDebounceTimer) {
      clearTimeout(this.filterDebounceTimer);
    }

    this.filterDebounceTimer = setTimeout(() => {
      this.loadOpportunities();
      this.filterDebounceTimer = null;
    }, 500);
  }

  clearFilters(): void {

    if (!this.hasFiltersApplied) {
      return;
    }

    this.filterClientName = '';
    this.filterStatus = '';

    if (this.filterDebounceTimer) {
      clearTimeout(this.filterDebounceTimer);
      this.filterDebounceTimer = null;
    }

    this.resetPaginationForAllColumns();
    this.loadOpportunities();
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
