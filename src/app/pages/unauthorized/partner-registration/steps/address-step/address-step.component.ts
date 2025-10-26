import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../../../../shared';

@Component({
    selector: 'app-address-step',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputComponent
    ],
    templateUrl: './address-step.component.html',
    styleUrls: ['./address-step.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddressStepComponent {
    @Input() addressForm!: AbstractControl;
    @Output() cepChange = new EventEmitter<any>();

    isAddressFieldInvalid(fieldName: string): boolean {
        const control = this.addressForm.get(fieldName);
        return !!(control && control.invalid && control.touched);
    }

    getAddressFieldErrorMessage(fieldName: string): string {
        const control = this.addressForm.get(fieldName);
        if (control && control.invalid && control.touched) {
            if (control.errors?.['required']) {
                return 'Este campo é obrigatório';
            }
            if (control.errors?.['maskPatternInvalid']) {
                const maskError = control.errors?.['maskPatternInvalid'];
                const expectedPattern = maskError?.expectedPatterns?.[0];

                if (fieldName === 'cep') {
                    return 'CEP deve ter o formato 00000-000';
                }

                // Mensagem genérica para outros campos de endereço
                return `Formato inválido. Esperado: ${expectedPattern || 'formato correto'}`;
            }
        }
        return '';
    }

    onCepChange(event: any): void {
        this.cepChange.emit(event);
    }
}
