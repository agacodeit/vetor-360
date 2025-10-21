import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastComponent, ToastConfig, ToastType } from './toast.component';

describe('ToastComponent', () => {
    let component: ToastComponent;
    let fixture: ComponentFixture<ToastComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ToastComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ToastComponent);
        component = fixture.componentInstance;
    });

    beforeEach(() => {
        // Configuração padrão para os testes
        component.config = {
            type: 'info',
            message: 'Test message',
            title: 'Test title',
            duration: 5000,
            closable: true
        };
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should set timeout when duration is provided', (done) => {
            spyOn(window, 'setTimeout').and.callThrough();
            component.config.duration = 1000;

            component.ngOnInit();

            expect(window.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 1000);
            done();
        });

        it('should not set timeout when duration is 0', () => {
            spyOn(window, 'setTimeout');
            component.config.duration = 0;

            component.ngOnInit();

            expect(window.setTimeout).not.toHaveBeenCalled();
        });

        it('should not set timeout when duration is negative', () => {
            spyOn(window, 'setTimeout');
            component.config.duration = -1000;

            component.ngOnInit();

            expect(window.setTimeout).not.toHaveBeenCalled();
        });

        it('should not set timeout when duration is undefined', () => {
            spyOn(window, 'setTimeout');
            component.config.duration = undefined;

            component.ngOnInit();

            expect(window.setTimeout).not.toHaveBeenCalled();
        });
    });

    describe('ngOnDestroy', () => {
        it('should clear timeout when timeoutId exists', () => {
            spyOn(window, 'clearTimeout');
            component['timeoutId'] = 123 as any;

            component.ngOnDestroy();

            expect(window.clearTimeout).toHaveBeenCalledWith(123);
        });

        it('should not call clearTimeout when timeoutId is undefined', () => {
            spyOn(window, 'clearTimeout');
            component['timeoutId'] = undefined;

            component.ngOnDestroy();

            expect(window.clearTimeout).not.toHaveBeenCalled();
        });
    });

    describe('closeToast', () => {
        it('should emit close event', () => {
            spyOn(component.close, 'emit');

            component.closeToast();

            expect(component.close.emit).toHaveBeenCalled();
        });
    });

    describe('getIconClass', () => {
        it('should return custom icon when provided', () => {
            component.config.icon = 'custom-icon';

            const result = component.getIconClass();

            expect(result).toBe('custom-icon');
        });

        it('should return default success icon', () => {
            component.config.type = 'success';
            component.config.icon = undefined;

            const result = component.getIconClass();

            expect(result).toBe('fa-solid fa-check-circle');
        });

        it('should return default error icon', () => {
            component.config.type = 'error';
            component.config.icon = undefined;

            const result = component.getIconClass();

            expect(result).toBe('fa-solid fa-exclamation-circle');
        });

        it('should return default warning icon', () => {
            component.config.type = 'warning';
            component.config.icon = undefined;

            const result = component.getIconClass();

            expect(result).toBe('fa-solid fa-triangle-exclamation');
        });

        it('should return default info icon', () => {
            component.config.type = 'info';
            component.config.icon = undefined;

            const result = component.getIconClass();

            expect(result).toBe('fa-solid fa-info-circle');
        });
    });

    describe('getToastClass', () => {
        it('should return correct CSS class for success type', () => {
            component.config.type = 'success';

            const result = component.getToastClass();

            expect(result).toBe('ds-toast toast-success');
        });

        it('should return correct CSS class for error type', () => {
            component.config.type = 'error';

            const result = component.getToastClass();

            expect(result).toBe('ds-toast toast-error');
        });

        it('should return correct CSS class for warning type', () => {
            component.config.type = 'warning';

            const result = component.getToastClass();

            expect(result).toBe('ds-toast toast-warning');
        });

        it('should return correct CSS class for info type', () => {
            component.config.type = 'info';

            const result = component.getToastClass();

            expect(result).toBe('ds-toast toast-info');
        });
    });

    describe('Template rendering', () => {
        it('should display toast title when provided', () => {
            component.config.title = 'Test Title';
            fixture.detectChanges();

            const titleElement = fixture.nativeElement.querySelector('.toast-title');
            expect(titleElement).toBeTruthy();
            expect(titleElement.textContent.trim()).toBe('Test Title');
        });

        it('should not display toast title when not provided', () => {
            component.config.title = undefined;
            fixture.detectChanges();

            const titleElement = fixture.nativeElement.querySelector('.toast-title');
            expect(titleElement).toBeFalsy();
        });

        it('should display toast message', () => {
            component.config.message = 'Test Message';
            fixture.detectChanges();

            const messageElement = fixture.nativeElement.querySelector('.toast-message');
            expect(messageElement).toBeTruthy();
            expect(messageElement.textContent.trim()).toBe('Test Message');
        });

        it('should display close button when closable is true', () => {
            component.config.closable = true;
            fixture.detectChanges();

            const closeButton = fixture.nativeElement.querySelector('.toast-close');
            expect(closeButton).toBeTruthy();
        });

        it('should display close button when closable is undefined', () => {
            component.config.closable = undefined;
            fixture.detectChanges();

            const closeButton = fixture.nativeElement.querySelector('.toast-close');
            expect(closeButton).toBeTruthy();
        });

        it('should not display close button when closable is false', () => {
            component.config.closable = false;
            fixture.detectChanges();

            const closeButton = fixture.nativeElement.querySelector('.toast-close');
            expect(closeButton).toBeFalsy();
        });

        it('should call closeToast when close button is clicked', () => {
            spyOn(component, 'closeToast');
            component.config.closable = true;
            fixture.detectChanges();

            const closeButton = fixture.nativeElement.querySelector('.toast-close');
            closeButton.click();

            expect(component.closeToast).toHaveBeenCalled();
        });
    });
});

