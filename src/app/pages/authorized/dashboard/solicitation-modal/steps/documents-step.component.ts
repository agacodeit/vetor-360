import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AccordionComponent, AccordionItem } from '../../../../../shared/components/atoms/accordion/accordion.component';

@Component({
    selector: 'app-documents-step',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, AccordionComponent],
    templateUrl: './documents-step.component.html',
    styleUrls: ['./documents-step.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DocumentsStepComponent {
    @Input() formData: any = {};
    @Output() formValid = new EventEmitter<boolean>();
    @Output() formDataChange = new EventEmitter<any>();

    documentsForm: FormGroup;

    // Itens do accordion
    accordionItems: AccordionItem[] = [
        {
            id: 'doc-required',
            title: '📄 Documentos Obrigatórios',
            content: `
        <p>Os seguintes documentos são obrigatórios para a sua solicitação:</p>
        <ul>
          <li><strong>RG ou CNH</strong> - Documento de identidade</li>
          <li><strong>CPF</strong> - Cadastro de Pessoa Física</li>
          <li><strong>Comprovante de Residência</strong> - Atualizado (últimos 3 meses)</li>
          <li><strong>Comprovante de Renda</strong> - Holerite ou declaração IR</li>
        </ul>
      `,
            expanded: true
        },
        {
            id: 'doc-optional',
            title: '📎 Documentos Complementares (Opcional)',
            content: `
        <p>Documentos adicionais que podem ajudar na análise:</p>
        <ul>
          <li>Extratos bancários dos últimos 3 meses</li>
          <li>Contrato social (para empresas)</li>
          <li>Balanço patrimonial</li>
          <li>Certidões negativas</li>
        </ul>
      `,
            expanded: false
        },
        {
            id: 'doc-instructions',
            title: 'ℹ️ Instruções de Upload',
            content: `
        <p><strong>Formato aceito:</strong> PDF, JPG, PNG (máx. 5MB por arquivo)</p>
        <p><strong>Qualidade:</strong> Certifique-se de que os documentos estejam legíveis</p>
        <p><strong>Observação:</strong> Você pode fazer o upload após criar a solicitação</p>
      `,
            expanded: false
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

        // Carregar dados iniciais se fornecidos
        if (this.formData) {
            this.documentsForm.patchValue(this.formData);
        }
    }

    onAccordionItemToggled(item: AccordionItem): void {
        console.log('Accordion item toggled:', item.title);
    }
}
