import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { RadioComponent, RadioOption } from '../../../../../shared';

@Component({
    selector: 'app-person-type-step',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RadioComponent
    ],
    templateUrl: './person-type-step.component.html',
    styleUrls: ['./person-type-step.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PersonTypeStepComponent {
    @Input() personTypeControl!: AbstractControl;
    @Output() personTypeChange = new EventEmitter<'F' | 'J'>();

    personTypeOptions: RadioOption[] = [
        { value: 'F', label: 'Pessoa física' },
        { value: 'J', label: 'Pessoa jurídica' }
    ];

    onPersonTypeChange(value: 'F' | 'J'): void {
        this.personTypeChange.emit(value);
    }
}
