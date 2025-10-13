import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AccordionComponent, AccordionItem, AccordionItemDirective, CheckboxComponent, IconComponent } from '../../../../../../shared';


export interface DocumentItem {
    id: string;
    label: string;
    required: boolean;
    file?: File;
    uploaded: boolean;
    acceptedFormats: string;
}

@Component({
    selector: 'app-documents-step',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AccordionComponent,
        AccordionItemDirective,
        CheckboxComponent,
        IconComponent
    ],
    templateUrl: './documents-step.component.html',
    styleUrls: ['./documents-step.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DocumentsStepComponent implements OnInit {
    @Input() formData: any = {};
    @Output() formValid = new EventEmitter<boolean>();
    @Output() formDataChange = new EventEmitter<any>();

    documentsForm: FormGroup;


    accordionItems: AccordionItem[] = [
        {
            id: 'doc-required',
            title: 'Documentos Obrigatórios',
            expanded: true
        }
    ];


    requiredDocuments: DocumentItem[] = [
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
    ];

    constructor(private fb: FormBuilder) {

        const formControls: { [key: string]: any } = {};
        this.requiredDocuments.forEach(doc => {
            formControls[doc.id] = [false]; // Checkbox começa desmarcado
        });

        this.documentsForm = this.fb.group(formControls);


        this.documentsForm.valueChanges.subscribe(value => {

            this.requiredDocuments.forEach(doc => {
                doc.uploaded = value[doc.id] || false;
            });

            this.formDataChange.emit({
                checkboxes: value,
                documents: this.requiredDocuments
            });
            this.formValid.emit(this.documentsForm.valid);
        });
    }

    ngOnInit(): void {

        if (this.formData && Object.keys(this.formData).length > 0) {

            if (this.formData.checkboxes) {
                this.documentsForm.patchValue(this.formData.checkboxes, { emitEvent: false });
            }


            if (this.formData.documents) {
                this.formData.documents.forEach((savedDoc: DocumentItem) => {
                    const doc = this.requiredDocuments.find(d => d.id === savedDoc.id);
                    if (doc) {
                        doc.file = savedDoc.file;
                        doc.uploaded = savedDoc.uploaded;
                    }
                });
            }
        }


        this.formValid.emit(this.documentsForm.valid);
    }

    onAccordionItemToggled(item: AccordionItem): void {
    }

    /**
     * Manipula o upload de arquivo
     */
    onFileSelected(event: Event, documentId: string): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            const document = this.requiredDocuments.find(doc => doc.id === documentId);

            if (document) {
                document.file = file;
                document.uploaded = true;


                this.documentsForm.patchValue({
                    [documentId]: true
                });

            }
        }
    }

    /**
     * Retorna o nome do arquivo ou texto padrão
     */
    getFileName(documentId: string): string {
        const document = this.requiredDocuments.find(doc => doc.id === documentId);
        return document?.file?.name || 'Selecionar';
    }

    /**
     * Remove o arquivo do documento
     */
    removeDocument(documentId: string): void {
        const document = this.requiredDocuments.find(doc => doc.id === documentId);

        if (document) {
            document.file = undefined;
            document.uploaded = false;


            this.documentsForm.patchValue({
                [documentId]: false
            });

        }
    }
}
