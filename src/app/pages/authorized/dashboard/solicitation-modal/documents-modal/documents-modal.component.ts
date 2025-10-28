import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastService, ModalService } from '../../../../../shared';

export interface SolicitationData {
    id: string;
    customerName: string;
    operation: string;
    value: number;
    valueType: string;
    activityTypeEnum: string;
    term: string;
    country: string;
    city: string;
    state: string;
    guarantee: string;
}

@Component({
    selector: 'app-documents-modal',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    templateUrl: './documents-modal.component.html',
    styleUrls: ['./documents-modal.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DocumentsModalComponent implements OnInit {
    @Input() solicitationData: SolicitationData | null = null;
    @Output() onClose = new EventEmitter<void>();
    @Output() onSubmit = new EventEmitter<any>();

    private toastService = inject(ToastService);
    private modalService = inject(ModalService);

    documentsForm: FormGroup;
    isLoading = false;
    documentsData: any = {};
    isDocumentsValid = true; // Por enquanto sempre válido para teste

    constructor(private fb: FormBuilder) {
        this.documentsForm = this.fb.group({});
    }

    ngOnInit(): void {
        // Inicialização do componente
    }

    handleClose(): void {
        this.onClose.emit();
    }

    handleSubmit(): void {
        if (this.isDocumentsValid) {
            this.isLoading = true;

            // Simular envio (substituir por chamada real da API)
            setTimeout(() => {
                this.isLoading = false;
                this.toastService.success('Documentos enviados com sucesso!', 'Sucesso');
                this.onSubmit.emit({
                    success: true,
                    solicitationId: this.solicitationData?.id,
                    documents: this.documentsData
                });
                this.handleClose();
            }, 2000);
        } else {
            this.toastService.error('Por favor, envie pelo menos um documento.', 'Documentos obrigatórios');
        }
    }

    onDocumentsChange(data: any): void {
        this.documentsData = data;
    }

    onDocumentsValidChange(isValid: boolean): void {
        this.isDocumentsValid = isValid;
    }

    getOperationDisplayName(operation: string): string {
        const operationMap: { [key: string]: string } = {
            'WORKING_CAPITAL_LONG_TERM': 'Capital de Giro de Longo Prazo',
            'STRUCTURED_REAL_ESTATE_CREDIT': 'Crédito Estruturado Imobiliário',
            'STRUCTURED_AGRIBUSINESS_CREDIT': 'Crédito Estruturado do Agronegócio',
            'INTERNATIONAL_FINANCING': 'Financiamento Internacional',
            'TRADE_FINANCE': 'Trade Finance',
            'M_AND_A': 'M&A'
        };
        return operationMap[operation] || operation;
    }

    getActivityDisplayName(activity: string): string {
        const activityMap: { [key: string]: string } = {
            'INDUSTRY': 'Indústria',
            'COMMERCE': 'Comércio',
            'SERVICES': 'Serviços'
        };
        return activityMap[activity] || activity;
    }

    formatCurrency(value: number, currency: string): string {
        const formatter = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: currency === 'BRL' ? 'BRL' : 'USD'
        });
        return formatter.format(value);
    }
}
