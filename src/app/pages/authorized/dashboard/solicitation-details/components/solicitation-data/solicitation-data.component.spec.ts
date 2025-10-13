import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitationDataComponent } from './solicitation-data.component';
import { KanbanCard } from '../../../../../../shared';

describe('SolicitationDataComponent', () => {
    let component: SolicitationDataComponent;
    let fixture: ComponentFixture<SolicitationDataComponent>;
    let compiled: HTMLElement;

    const mockCardData: KanbanCard = {
        id: '1',
        title: 'Test Solicitation',
        status: 'in-analysis',
        client: 'Test Client',
        cnpj: '12.345.678/0001-90'
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SolicitationDataComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SolicitationDataComponent);
        component = fixture.componentInstance;
        compiled = fixture.nativeElement;
        fixture.detectChanges();
    });

    describe('Component Initialization', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should initialize cardData as null', () => {
            expect(component.cardData).toBeNull();
        });
    });

    describe('Input Properties', () => {
        it('should accept cardData input', () => {
            component.cardData = mockCardData;
            fixture.detectChanges();

            expect(component.cardData).toEqual(mockCardData);
        });

        it('should handle null cardData', () => {
            component.cardData = null;
            fixture.detectChanges();

            expect(component.cardData).toBeNull();
        });
    });

    describe('getStatusLabel Method', () => {
        it('should return "Status desconhecido" when cardData is null', () => {
            component.cardData = null;

            const label = component.getStatusLabel();

            expect(label).toBe('Status desconhecido');
        });

        it('should return "Status desconhecido" when status is undefined', () => {
            component.cardData = { id: '1', title: 'Test' } as KanbanCard;

            const label = component.getStatusLabel();

            expect(label).toBe('Status desconhecido');
        });

        it('should return correct label for "pending-documents" status', () => {
            component.cardData = { ...mockCardData, status: 'pending-documents' };

            const label = component.getStatusLabel();

            expect(label).toBe('Pendente de documentos');
        });

        it('should return correct label for "in-analysis" status', () => {
            component.cardData = { ...mockCardData, status: 'in-analysis' };

            const label = component.getStatusLabel();

            expect(label).toBe('Em análise');
        });

        it('should return correct label for "approved" status', () => {
            component.cardData = { ...mockCardData, status: 'approved' };

            const label = component.getStatusLabel();

            expect(label).toBe('Aprovado');
        });

        it('should return correct label for "rejected" status', () => {
            component.cardData = { ...mockCardData, status: 'rejected' };

            const label = component.getStatusLabel();

            expect(label).toBe('Rejeitado');
        });
    });

    describe('Template Rendering', () => {
        it('should render section element', () => {
            const section = compiled.querySelector('.solicitation-data');
            expect(section).toBeTruthy();
        });

        it('should have grid layout with 2 columns', () => {
            const section = compiled.querySelector('.solicitation-data');
            expect(section?.classList.contains('columns-2')).toBe(true);
        });

        it('should render "Solicitação" title', () => {
            const title = compiled.querySelector('.title-semibold');
            expect(title?.textContent?.trim()).toContain('Solicitação');
        });

        it('should display status label', () => {
            component.cardData = { ...mockCardData, status: 'in-analysis' };
            fixture.detectChanges();

            const statusLabel = compiled.querySelector('.solicitation-data__status .title-semibold');
            expect(statusLabel?.textContent?.trim()).toBe('Em análise');
        });

        it('should display "Status desconhecido" when no cardData', () => {
            component.cardData = null;
            fixture.detectChanges();

            const statusLabel = compiled.querySelector('.solicitation-data__status .title-semibold');
            expect(statusLabel?.textContent?.trim()).toBe('Status desconhecido');
        });

        it('should have correct CSS classes', () => {
            const info = compiled.querySelector('.solicitation-data__info');
            const status = compiled.querySelector('.solicitation-data__status');

            expect(info).toBeTruthy();
            expect(status).toBeTruthy();
        });
    });

    describe('Integration Tests', () => {
        it('should update display when cardData changes', () => {
            component.cardData = { ...mockCardData, status: 'pending-documents' };
            fixture.detectChanges();

            let statusLabel = compiled.querySelector('.solicitation-data__status .title-semibold');
            expect(statusLabel?.textContent?.trim()).toBe('Pendente de documentos');

            component.cardData = { ...mockCardData, status: 'approved' };
            fixture.detectChanges();

            statusLabel = compiled.querySelector('.solicitation-data__status .title-semibold');
            expect(statusLabel?.textContent?.trim()).toBe('Aprovado');
        });
    });
});

