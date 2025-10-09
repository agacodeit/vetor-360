import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AccordionComponent, AccordionItem, AccordionItemDirective } from '../../../../../../shared';

@Component({
    selector: 'app-documents-step',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, AccordionComponent, AccordionItemDirective],
    templateUrl: './documents-step.component.html',
    styleUrls: ['./documents-step.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DocumentsStepComponent {
    @Input() formData: any = {};
    @Output() formValid = new EventEmitter<boolean>();
    @Output() formDataChange = new EventEmitter<any>();

    documentsForm: FormGroup;

    // Itens do accordion (apenas metadados, sem content)
    accordionItems: AccordionItem[] = [
        {
            id: 'doc-required',
            title: '📄 Documentos Obrigatórios',
            expanded: true
        }
    ];

    constructor(private fb: FormBuilder) {
        this.documentsForm = this.fb.group({
            // Por enquanto vazio, será implementado futuramente
        });

        // Emitir mudanças do formulário
        this.documentsForm.valueChanges.subscribe(value => {
            this.formDataChange.emit(value);
            this.formValid.emit(this.documentsForm.valid);
        });

        // Preencher com dados iniciais se fornecidos
        if (this.formData) {
            this.documentsForm.patchValue(this.formData);
        }
    }

    ngOnInit(): void {
        // Inicializar validação
        this.formValid.emit(this.documentsForm.valid);
    }

    onAccordionItemToggled(item: AccordionItem): void {
        console.log('Accordion item toggled:', item.title);
    }
}
