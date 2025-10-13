import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

export interface StepperStep {
    id: string;
    title: string;
    description?: string;
    icon?: string;
    completed?: boolean;
    disabled?: boolean;
    error?: boolean;
}

@Component({
    selector: 'ds-stepper',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './stepper.component.html',
    styleUrls: ['./stepper.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StepperComponent implements OnInit {
    @Input() steps: StepperStep[] = [];
    @Input() currentStep: number = 0;
    @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
    @Input() variant: 'default' | 'dots' | 'numbers' = 'default';
    @Input() size: 'sm' | 'md' | 'lg' = 'md';
    @Input() clickable: boolean = true;
    @Input() showConnector: boolean = true;

    @Output() stepClicked = new EventEmitter<StepperStep>();
    @Output() stepChanged = new EventEmitter<number>();

    ngOnInit(): void {

        if (this.currentStep < 0 || this.currentStep >= this.steps.length) {
            this.currentStep = 0;
        }
    }

    selectStep(step: StepperStep, index: number): void {
        if (!this.clickable || step.disabled) return;

        this.currentStep = index;
        this.stepClicked.emit(step);
        this.stepChanged.emit(index);
    }

    isStepActive(step: StepperStep, index: number): boolean {
        return index === this.currentStep;
    }

    isStepCompleted(step: StepperStep, index: number): boolean {
        return step.completed || index < this.currentStep;
    }

    isStepAccessible(step: StepperStep, index: number): boolean {
        return !step.disabled && (this.clickable || index <= this.currentStep);
    }

    getStepStatus(step: StepperStep, index: number): 'completed' | 'active' | 'pending' | 'error' | 'disabled' {
        if (step.error) return 'error';
        if (step.disabled) return 'disabled';
        if (this.isStepCompleted(step, index)) return 'completed';
        if (this.isStepActive(step, index)) return 'active';
        return 'pending';
    }

    get stepperClasses(): string {
        const classes = ['stepper-container'];
        classes.push(`orientation-${this.orientation}`);
        classes.push(`variant-${this.variant}`);
        classes.push(`size-${this.size}`);

        if (this.showConnector) classes.push('with-connector');
        if (this.clickable) classes.push('clickable');

        return classes.join(' ');
    }

    get stepClasses(): string {
        const classes = ['step-item'];
        classes.push(`variant-${this.variant}`);
        classes.push(`size-${this.size}`);

        return classes.join(' ');
    }
}
