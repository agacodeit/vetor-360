import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../../../../shared';

@Component({
    selector: 'app-password-step',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputComponent
    ],
    templateUrl: './password-step.component.html',
    styleUrls: ['./password-step.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PasswordStepComponent {
    @Input() passwordForm!: FormGroup;

    isFieldInvalid(fieldName: string): boolean {
        const control = this.passwordForm.get(fieldName);
        return !!(control && control.invalid && control.touched);
    }

    getFieldErrorMessage(fieldName: string): string {
        const control = this.passwordForm.get(fieldName);
        if (control && control.invalid && control.touched) {
            if (control.errors?.['required']) {
                return 'Este campo é obrigatório';
            }
            if (control.errors?.['minlength']) {
                return `Mínimo de ${control.errors?.['minlength'].requiredLength} caracteres`;
            }
            if (control.errors?.['passwordMismatch']) {
                return 'As senhas não coincidem';
            }
        }
        return '';
    }
}
