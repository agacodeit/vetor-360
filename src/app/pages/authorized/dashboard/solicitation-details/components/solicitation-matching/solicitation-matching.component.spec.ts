import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { SolicitationMatchingComponent } from './solicitation-matching.component';
import { MatchingService, MatchingAnalysis } from '../../../../../../shared/services/matching/matching.service';
import { MOCK_KANBAN_CARD } from '../../../../../../shared/__mocks__';
import { ToastService } from '../../../../../../shared';

describe('SolicitationMatchingComponent', () => {
    let component: SolicitationMatchingComponent;
    let fixture: ComponentFixture<SolicitationMatchingComponent>;
    let compiled: HTMLElement;
    let matchingServiceMock: jasmine.SpyObj<MatchingService>;
    let toastServiceMock: jasmine.SpyObj<ToastService>;

    const mockAnalysis: MatchingAnalysis = {
        id: 'analysis-1',
        opportunityId: 'op-1',
        analysisDate: '2025-11-11T00:49:52',
        analysisText: 'Resumo Executivo: Após avaliação detalhada.'
    };

    beforeEach(async () => {
        matchingServiceMock = jasmine.createSpyObj('MatchingService', ['executeAnalysis']);
        toastServiceMock = jasmine.createSpyObj('ToastService', ['success', 'error']);

        await TestBed.configureTestingModule({
            imports: [SolicitationMatchingComponent],
            providers: [
                { provide: MatchingService, useValue: matchingServiceMock },
                { provide: ToastService, useValue: toastServiceMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(SolicitationMatchingComponent);
        component = fixture.componentInstance;
        compiled = fixture.nativeElement;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render matching title', () => {
        const title = compiled.querySelector('.title-semibold');
        expect(title?.textContent?.trim()).toBe('Matching');
    });

    it('should render four analysis lines by default', () => {
        const paragraphs = compiled.querySelectorAll('.solicitation-matching__content p');
        expect(paragraphs.length).toBeGreaterThan(0);
    });

    it('should adapt analysis when cardData is provided', () => {
        component.cardData = {
            ...MOCK_KANBAN_CARD,
            data: {
                ...MOCK_KANBAN_CARD.data,
                opportunity: {
                    ...(MOCK_KANBAN_CARD.data?.opportunity ?? {}),
                    matchingAnalyses: [mockAnalysis]
                }
            }
        };
        fixture.detectChanges();

        const content = compiled.textContent || '';
        expect(content).toContain('Resumo Executivo');
    });

    it('should call matching service when triggerAnalysis is invoked', () => {
        component.cardData = {
            id: 'op-1',
            status: 'PENDING_DOCUMENTS',
            title: 'Opportunity',
            data: {
                opportunity: { id: 'op-1' }
            }
        } as any;
        matchingServiceMock.executeAnalysis.and.returnValue(of(mockAnalysis));

        component.triggerAnalysis();

        expect(matchingServiceMock.executeAnalysis).toHaveBeenCalledWith('op-1');
        expect(toastServiceMock.success).toHaveBeenCalled();
    });

    it('should handle service error when triggerAnalysis fails', () => {
        component.cardData = {
            id: 'op-1',
            status: 'PENDING_DOCUMENTS',
            title: 'Opportunity',
            data: {
                opportunity: { id: 'op-1' }
            }
        } as any;
        matchingServiceMock.executeAnalysis.and.returnValue(throwError(() => new Error('fail')));

        component.triggerAnalysis();

        expect(toastServiceMock.error).toHaveBeenCalled();
    });
});

