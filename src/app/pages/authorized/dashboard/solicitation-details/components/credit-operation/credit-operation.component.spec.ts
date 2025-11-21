import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreditOperationComponent } from './credit-operation.component';
import { KanbanCard } from '../../../../../../shared';

describe('CreditOperationComponent', () => {
    let component: CreditOperationComponent;
    let fixture: ComponentFixture<CreditOperationComponent>;
    let compiled: HTMLElement;

    const mockCardData: KanbanCard = {
        id: '1',
        title: 'Test Card',
        status: 'PENDING_DOCUMENTS',
        client: 'Cliente Teste',
        cnpj: '11.222.333/0001-44',
        data: {
            opportunity: {
                id: 'opp-1',
                term: 36,
                guarantee: 'Imóvel',
                value: 800000,
                valueType: 'BRL'
            },
            valueLabel: 'R$ 800.000,00',
            operationLabel: 'Crédito com cobertura FGI',
            statusLabel: 'Pendente de documentos'
        }
    } as KanbanCard;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CreditOperationComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CreditOperationComponent);
        component = fixture.componentInstance;
        component.cardData = mockCardData;
        compiled = fixture.nativeElement;
        fixture.detectChanges();
    });

    describe('Component Initialization', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should initialize cardData when set', () => {
            expect(component.cardData).toEqual(mockCardData);
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

        it('should update when cardData changes', () => {
            const newData = { ...mockCardData, id: '2' };

            component.cardData = newData;
            fixture.detectChanges();

            expect(component.cardData?.id).toBe('2');
        });
    });

    describe('Template Rendering', () => {
        it('should render section element', () => {
            const section = compiled.querySelector('.credit-operation');
            expect(section).toBeTruthy();
        });

        it('should have grid layout with 1 column', () => {
            const section = compiled.querySelector('.credit-operation');
            expect(section?.classList.contains('d-grid')).toBe(true);
            expect(section?.classList.contains('columns-1')).toBe(true);
        });

        it('should render "Operação de Crédito Solicitada" title', () => {
            const title = compiled.querySelector('.title-semibold');
            expect(title?.textContent?.trim()).toBe('Operação de Crédito Solicitada');
        });

        it('should display credit amount', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Valor solicitado');
            expect(content).toContain('R$ 800.000,00');
        });

        it('should display term', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Prazo');
            expect(content).toContain('36 meses');
        });

        it('should display guarantee', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Garantia');
            expect(content).toContain('Imóvel');
        });

        it('should display client name', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Nome do Cliente');
            expect(content).toContain('Cliente Teste');
        });

        it('should display operation label', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Operação');
            expect(content).toContain('Crédito com cobertura FGI');
        });

        it('should display status', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Status');
            expect(content).toContain('Pendente de documentos');
        });

        it('should have 2-column grid for data', () => {
            const dataGrid = compiled.querySelector('.credit-operation__data');
            expect(dataGrid?.classList.contains('d-grid')).toBe(true);
            expect(dataGrid?.classList.contains('columns-2')).toBe(true);
        });

        it('should have info section with correct structure', () => {
            const info = compiled.querySelector('.credit-operation__info');
            expect(info).toBeTruthy();
            expect(info?.classList.contains('d-flex')).toBe(true);
            expect(info?.classList.contains('flex-column')).toBe(true);
        });

        it('should have values section with correct structure', () => {
            const values = compiled.querySelector('.credit-operation__values');
            expect(values).toBeTruthy();
            expect(values?.classList.contains('d-flex')).toBe(true);
            expect(values?.classList.contains('flex-column')).toBe(true);
        });
    });

    describe('Data Fields', () => {
        it('should display all credit operation labels', () => {
            const infoBlocks = compiled.querySelectorAll('.credit-operation__info .credit-operation__block');
            expect(infoBlocks.length).toBe(6); // Nome do Cliente, Operação, Valor solicitado, Prazo, Garantia, Status
        });

        it('should display all credit operation values', () => {
            const valueBlocks = compiled.querySelectorAll('.credit-operation__values .credit-operation__block');
            expect(valueBlocks.length).toBe(6); // Nome do Cliente, Operação, Valor solicitado, Prazo, Garantia, Status
        });

        it('should have matching number of labels and values', () => {
            const infoBlocks = compiled.querySelectorAll('.credit-operation__info .credit-operation__block');
            const valueBlocks = compiled.querySelectorAll('.credit-operation__values .credit-operation__block');
            expect(infoBlocks.length).toBe(valueBlocks.length);
        });
    });

    describe('Integration Tests', () => {
        it('should display complete credit operation information', () => {
            component.cardData = mockCardData;
            fixture.detectChanges();

            const content = compiled.textContent || '';

            expect(content).toContain('Operação de Crédito Solicitada');
            expect(content).toContain('Crédito com cobertura FGI');
            expect(content).toContain('R$ 800.000,00');
            expect(content).toContain('36 meses');
            expect(content).toContain('Imóvel');
            expect(content).toContain('Cliente Teste');
            expect(content).toContain('Pendente de documentos');
        });

        it('should maintain structure without cardData', () => {
            component.cardData = null;
            fixture.detectChanges();

            const section = compiled.querySelector('.credit-operation');
            const data = compiled.querySelector('.credit-operation__data');
            const info = compiled.querySelector('.credit-operation__info');
            const values = compiled.querySelector('.credit-operation__values');

            expect(section).toBeTruthy();
            expect(data).toBeTruthy();
            expect(info).toBeTruthy();
            expect(values).toBeTruthy();
        });

        it('should display all financial details correctly', () => {
            component.cardData = mockCardData;
            fixture.detectChanges();

            const content = compiled.textContent || '';
            expect(content).toContain('R$ 800.000,00');
            expect(content).toContain('36 meses');
            expect(content).toContain('Imóvel');
        });
    });
});

