import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancialAgentComponent } from './financial-agent.component';

describe('FinancialAgentComponent', () => {
    let component: FinancialAgentComponent;
    let fixture: ComponentFixture<FinancialAgentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FinancialAgentComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(FinancialAgentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

