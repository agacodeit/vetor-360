import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastContainerComponent } from './toast-container.component';
import { ToastConfig } from './toast.component';

describe('ToastContainerComponent', () => {
    let component: ToastContainerComponent;
    let fixture: ComponentFixture<ToastContainerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ToastContainerComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ToastContainerComponent);
        component = fixture.componentInstance;
    });

    beforeEach(() => {
        // Limpar window.toastContainer antes de cada teste
        if ((window as any).toastContainer) {
            delete (window as any).toastContainer;
        }
    });

    afterEach(() => {
        // Limpar window.toastContainer após cada teste
        if ((window as any).toastContainer) {
            delete (window as any).toastContainer;
        }
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should set window.toastContainer reference', () => {
            component.ngOnInit();

            expect((window as any).toastContainer).toBe(component);
        });
    });

    describe('ngOnDestroy', () => {
        it('should remove window.toastContainer reference when it matches this component', () => {
            (window as any).toastContainer = component;

            component.ngOnDestroy();

            expect((window as any).toastContainer).toBeUndefined();
        });

        it('should not remove window.toastContainer reference when it does not match this component', () => {
            const otherComponent = {} as ToastContainerComponent;
            (window as any).toastContainer = otherComponent;

            component.ngOnDestroy();

            expect((window as any).toastContainer).toBe(otherComponent);
        });
    });

    describe('addToast', () => {
        it('should add toast to toasts array with default values', () => {
            const config: ToastConfig = {
                type: 'success',
                message: 'Test message'
            };

            component.addToast(config);

            expect(component.toasts.length).toBe(1);
            expect(component.toasts[0]).toEqual({
                type: 'success',
                message: 'Test message',
                duration: 5000,
                closable: true
            });
        });

        it('should merge custom values with default values', () => {
            const config: ToastConfig = {
                type: 'error',
                message: 'Test message',
                duration: 3000,
                closable: false,
                title: 'Custom title'
            };

            component.addToast(config);

            expect(component.toasts.length).toBe(1);
            expect(component.toasts[0]).toEqual({
                type: 'error',
                message: 'Test message',
                duration: 3000,
                closable: false,
                title: 'Custom title'
            });
        });

        it('should set timeout when duration is provided and greater than 0', (done) => {
            spyOn(window, 'setTimeout').and.callThrough();
            const config: ToastConfig = {
                type: 'info',
                message: 'Test message',
                duration: 1000
            };

            component.addToast(config);

            expect(window.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 1000);
            done();
        });

        it('should not set timeout when duration is 0', () => {
            spyOn(window, 'setTimeout');
            const config: ToastConfig = {
                type: 'info',
                message: 'Test message',
                duration: 0
            };

            component.addToast(config);

            expect(window.setTimeout).not.toHaveBeenCalled();
        });

        it('should not set timeout when duration is negative', () => {
            spyOn(window, 'setTimeout');
            const config: ToastConfig = {
                type: 'info',
                message: 'Test message',
                duration: -1000
            };

            component.addToast(config);

            expect(window.setTimeout).not.toHaveBeenCalled();
        });

        it('should remove toast after timeout', (done) => {
            const config: ToastConfig = {
                type: 'info',
                message: 'Test message',
                duration: 100
            };

            component.addToast(config);
            expect(component.toasts.length).toBe(1);

            setTimeout(() => {
                expect(component.toasts.length).toBe(0);
                done();
            }, 150);
        });
    });

    describe('removeToast', () => {
        it('should remove toast from toasts array', () => {
            const toast1: ToastConfig = { type: 'success', message: 'Message 1' };
            const toast2: ToastConfig = { type: 'error', message: 'Message 2' };

            component.addToast(toast1);
            component.addToast(toast2);
            expect(component.toasts.length).toBe(2);

            // Remove using the actual toast object from the array (with defaults applied)
            component.removeToast(component.toasts[0]);

            expect(component.toasts.length).toBe(1);
            expect(component.toasts[0].type).toBe('error');
            expect(component.toasts[0].message).toBe('Message 2');
        });

        it('should not remove toast if it does not exist in array', () => {
            const toast1: ToastConfig = { type: 'success', message: 'Message 1' };
            const toast2: ToastConfig = { type: 'error', message: 'Message 2' };

            component.addToast(toast1);
            expect(component.toasts.length).toBe(1);

            component.removeToast(toast2);

            expect(component.toasts.length).toBe(1);
            expect(component.toasts[0].type).toBe('success');
            expect(component.toasts[0].message).toBe('Message 1');
        });
    });

    describe('clearAllToasts', () => {
        it('should clear all toasts from array', () => {
            component.addToast({ type: 'success', message: 'Message 1' });
            component.addToast({ type: 'error', message: 'Message 2' });
            expect(component.toasts.length).toBe(2);

            component.clearAllToasts();

            expect(component.toasts.length).toBe(0);
        });
    });

    describe('success method', () => {
        it('should add success toast with correct configuration', () => {
            spyOn(component, 'addToast');

            component.success('Success message', 'Success title', { duration: 3000 });

            expect(component.addToast).toHaveBeenCalledWith({
                type: 'success',
                message: 'Success message',
                title: 'Success title',
                duration: 3000
            });
        });

        it('should add success toast without title and options', () => {
            spyOn(component, 'addToast');

            component.success('Success message');

            expect(component.addToast).toHaveBeenCalledWith({
                type: 'success',
                message: 'Success message',
                title: undefined
            });
        });
    });

    describe('error method', () => {
        it('should add error toast with correct configuration', () => {
            spyOn(component, 'addToast');

            component.error('Error message', 'Error title', { duration: 3000 });

            expect(component.addToast).toHaveBeenCalledWith({
                type: 'error',
                message: 'Error message',
                title: 'Error title',
                duration: 3000
            });
        });
    });

    describe('warning method', () => {
        it('should add warning toast with correct configuration', () => {
            spyOn(component, 'addToast');

            component.warning('Warning message', 'Warning title', { duration: 3000 });

            expect(component.addToast).toHaveBeenCalledWith({
                type: 'warning',
                message: 'Warning message',
                title: 'Warning title',
                duration: 3000
            });
        });
    });

    describe('info method', () => {
        it('should add info toast with correct configuration', () => {
            spyOn(component, 'addToast');

            component.info('Info message', 'Info title', { duration: 3000 });

            expect(component.addToast).toHaveBeenCalledWith({
                type: 'info',
                message: 'Info message',
                title: 'Info title',
                duration: 3000
            });
        });
    });

    describe('trackByToast', () => {
        it('should return unique identifier for toast', () => {
            const toast: ToastConfig = { type: 'success', message: 'Test message' };

            const result = component.trackByToast(0, toast);

            expect(result).toBe('success-Test message-0');
        });

        it('should return different identifiers for different toasts', () => {
            const toast1: ToastConfig = { type: 'success', message: 'Message 1' };
            const toast2: ToastConfig = { type: 'error', message: 'Message 2' };

            const result1 = component.trackByToast(0, toast1);
            const result2 = component.trackByToast(1, toast2);

            expect(result1).not.toBe(result2);
        });
    });

    describe('Template rendering', () => {
        it('should not display container when no toasts exist', () => {
            component.toasts = [];
            fixture.detectChanges();

            const container = fixture.nativeElement.querySelector('.toast-container');
            expect(container).toBeFalsy();
        });

        it('should display container when toasts exist', () => {
            component.addToast({ type: 'success', message: 'Test message' });
            fixture.detectChanges();

            const container = fixture.nativeElement.querySelector('.toast-container');
            expect(container).toBeTruthy();
        });

        it('should render toast components for each toast', () => {
            component.addToast({ type: 'success', message: 'Message 1' });
            component.addToast({ type: 'error', message: 'Message 2' });
            fixture.detectChanges();

            const toastComponents = fixture.nativeElement.querySelectorAll('ds-toast');
            expect(toastComponents.length).toBe(2);
        });

        it('should call removeToast when toast close event is emitted', () => {
            spyOn(component, 'removeToast');
            const toast: ToastConfig = { type: 'success', message: 'Test message' };
            component.addToast(toast);
            fixture.detectChanges();

            const toastComponent = fixture.nativeElement.querySelector('ds-toast');
            const closeEvent = new CustomEvent('close');
            toastComponent.dispatchEvent(closeEvent);

            // Should be called with the actual toast object from the array (with defaults)
            expect(component.removeToast).toHaveBeenCalledWith(component.toasts[0]);
        });
    });
});
