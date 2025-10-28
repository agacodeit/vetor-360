import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { DocumentsComponent, DocumentsConfig } from '../../../../../shared';

@Component({
    selector: 'app-documents-step',
    standalone: true,
    imports: [
        CommonModule,
        DocumentsComponent
    ],
    templateUrl: './documents-step.component.html',
    styleUrls: ['./documents-step.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DocumentsStepComponent {
    @Input() documentsConfig!: DocumentsConfig;
    @Output() documentsChange = new EventEmitter<any>();
    @Output() documentUploaded = new EventEmitter<any>();
    @Output() documentRemoved = new EventEmitter<string>();
    @Output() formValid = new EventEmitter<boolean>();

    onDocumentsChange(event: any): void {
        this.documentsChange.emit(event);
    }

    onDocumentUploaded(event: any): void {
        this.documentUploaded.emit(event);
    }

    onDocumentRemoved(documentId: string): void {
        this.documentRemoved.emit(documentId);
    }

    onFormValid(isValid: boolean): void {
        this.formValid.emit(isValid);
    }
}
