import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextareaComponent } from '../../../../../../shared/components/atoms/textarea/textarea.component';

@Component({
    selector: 'app-guarantees-step',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TextareaComponent
    ],
    templateUrl: './guarantees-step.component.html',
    styleUrls: ['./guarantees-step.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GuaranteesStepComponent implements OnInit {
    @Input() formData: any = {};
    @Output() formValid = new EventEmitter<boolean>();
    @Output() formDataChange = new EventEmitter<any>();

    guaranteesForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.guaranteesForm = this.fb.group({
            guarantees: ['', [Validators.required, Validators.maxLength(1000)]]
        });

        // Emitir mudanças do formulário
        this.guaranteesForm.valueChanges.subscribe(value => {
            this.formDataChange.emit(value);
            this.formValid.emit(this.guaranteesForm.valid);
        });
    }

    ngOnInit(): void {
        // Carregar dados salvos se existirem
        if (this.formData && Object.keys(this.formData).length > 0) {
            this.guaranteesForm.patchValue(this.formData, { emitEvent: false });
        }

        // Emitir estado inicial de validade
        this.formValid.emit(this.guaranteesForm.valid);
    }

    // Getter para facilitar o acesso ao controle
    get guarantees() { return this.guaranteesForm.get('guarantees'); }
}
