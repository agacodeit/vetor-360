import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DocumentsModalComponent } from './documents-modal.component';

describe('DocumentsModalComponent', () => {
    let component: DocumentsModalComponent;
    let fixture: ComponentFixture<DocumentsModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DocumentsModalComponent, HttpClientTestingModule]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DocumentsModalComponent);
        component = fixture.componentInstance;
        // Set solicitationData to avoid null error in getStatusLabel
        component.solicitationData = {
            id: '1',
            status: 'PENDING_DOCUMENTS',
            customerName: 'Test Customer'
        };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
