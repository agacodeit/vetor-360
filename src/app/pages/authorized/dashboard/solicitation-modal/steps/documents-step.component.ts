import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-documents-step',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './documents-step.component.html',
    styleUrls: ['./documents-step.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DocumentsStepComponent {
    @Input() formData: any = {};
    @Output() formValid = new EventEmitter<boolean>();
    @Output() formDataChange = new EventEmitter<any>();

    documentsForm: FormGroup;

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
}
