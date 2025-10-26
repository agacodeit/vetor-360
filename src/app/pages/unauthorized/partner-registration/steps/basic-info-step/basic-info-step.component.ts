import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../../../../shared';

@Component({
    selector: 'app-basic-info-step',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputComponent
    ],
    templateUrl: './basic-info-step.component.html',
    styleUrls: ['./basic-info-step.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BasicInfoStepComponent {
    @Input() basicInfoForm!: FormGroup;
    @Input() isPersonFisica!: boolean;
    @Input() isPersonJuridica!: boolean;

    isFieldInvalid(fieldName: string): boolean {
        const control = this.basicInfoForm.get(fieldName);
        return !!(control && control.invalid && control.touched);
    }

    getFieldErrorMessage(fieldName: string): string {
        const control = this.basicInfoForm.get(fieldName);
        if (control && control.invalid && control.touched) {
            if (control.errors?.['required']) {
                return 'Este campo é obrigatório';
            }
            if (control.errors?.['email']) {
                return 'E-mail inválido';
            }
            if (control.errors?.['minlength']) {
                return `Mínimo de ${control.errors?.['minlength'].requiredLength} caracteres`;
            }
            if (control.errors?.['maskPatternInvalid']) {
                const maskError = control.errors?.['maskPatternInvalid'];
                const expectedPattern = maskError?.expectedPatterns?.[0];

                if (fieldName === 'cpfCnpj') {
                    if (this.isPersonFisica) {
                        return 'CPF deve ter o formato 000.000.000-00';
                    } else if (this.isPersonJuridica) {
                        return 'CNPJ deve ter o formato 00.000.000/0000-00';
                    }
                }
                if (fieldName === 'cellphone') {
                    return 'Celular deve ter o formato (00) 00000-0000';
                }
                if (fieldName === 'comercialPhone') {
                    return 'Telefone deve ter o formato (00) 0000-0000';
                }

                return `Formato inválido. Esperado: ${expectedPattern || 'formato correto'}`;
            }
        }
        return '';
    }
}
