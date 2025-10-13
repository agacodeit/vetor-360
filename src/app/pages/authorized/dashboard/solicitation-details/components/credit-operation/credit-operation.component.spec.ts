import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreditOperationComponent } from './credit-operation.component';

describe('CreditOperationComponent', () => {
    let component: CreditOperationComponent;
    let fixture: ComponentFixture<CreditOperationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CreditOperationComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(CreditOperationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

