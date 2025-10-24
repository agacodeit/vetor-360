import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { DocumentsComponent, DocumentsConfig, DocumentItem } from '../../../../../../shared';


// DocumentItem interface is now imported from the shared component

@Component({
    selector: 'app-documents-step',
    standalone: true,
    imports: [
        CommonModule,
        DocumentsComponent
    ],
    templateUrl: './documents-step.component.html',
    styleUrls: ['./documents-step.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DocumentsStepComponent implements OnInit {
    @Input() formData: any = {};
    @Output() formValid = new EventEmitter<boolean>();
    @Output() formDataChange = new EventEmitter<any>();

    documentsConfig: DocumentsConfig = {
        title: 'Documentos Obrigatórios',
        showAccordion: true,
        allowMultiple: true,
        documents: [
            {
                id: 'rg-cnh',
                label: 'RG ou CNH - Documento de identidade',
                required: true,
                uploaded: false,
                acceptedFormats: '.pdf,.jpg,.jpeg,.png'
            },
            {
                id: 'cpf',
                label: 'CPF - Cadastro de Pessoa Física',
                required: true,
                uploaded: false,
                acceptedFormats: '.pdf,.jpg,.jpeg,.png'
            },
            {
                id: 'comprovante-residencia',
                label: 'Comprovante de Residência (últimos 3 meses)',
                required: true,
                uploaded: false,
                acceptedFormats: '.pdf,.jpg,.jpeg,.png'
            }
        ]
    };

    constructor() { }

    ngOnInit(): void {
        // O componente ds-documents já gerencia a inicialização
    }

    /**
     * Manipula mudanças nos documentos
     */
    onDocumentsChange(event: any): void {
        this.formDataChange.emit(event);
    }

    /**
     * Manipula upload de documento
     */
    onDocumentUploaded(event: any): void {
        console.log('Document uploaded:', event);
        // Aqui você pode adicionar lógica adicional se necessário
    }

    /**
     * Manipula remoção de documento
     */
    onDocumentRemoved(documentId: string): void {
        console.log('Document removed:', documentId);
        // Aqui você pode adicionar lógica adicional se necessário
    }

    /**
     * Manipula validade do formulário
     */
    onFormValid(isValid: boolean): void {
        this.formValid.emit(isValid);
    }
}
