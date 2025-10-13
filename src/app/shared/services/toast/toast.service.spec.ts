import { TestBed } from '@angular/core/testing';

import { ToastService } from './toast.service';
import { ToastConfig } from '../../components/atoms/toast/toast.component';
import { setupToastContainerMock, cleanupToastContainerMock, MockToastContainer } from '../../__mocks__';

describe('ToastService', () => {
    let service: ToastService;
    let mockContainer: MockToastContainer;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ToastService);

        // Configurar mock do toast container usando helper
        mockContainer = setupToastContainerMock();
    });

    afterEach(() => {
        // Limpar o mock após cada teste usando helper
        cleanupToastContainerMock();
    });

    describe('Service Initialization', () => {
        it('should be created', () => {
            expect(service).toBeTruthy();
        });
    });

    describe('success Method', () => {
        it('should call addToast with success configuration', () => {
            service.success('Success message', 'Success Title');

            expect(mockContainer.addToast).toHaveBeenCalledWith({
                type: 'success',
                message: 'Success message',
                title: 'Success Title',
                duration: 5000,
                closable: true
            });
        });

        it('should call addToast with success configuration without title', () => {
            service.success('Success message');

            expect(mockContainer.addToast).toHaveBeenCalledWith({
                type: 'success',
                message: 'Success message',
                title: undefined,
                duration: 5000,
                closable: true
            });
        });

        it('should merge custom options with success defaults', () => {
            service.success('Success message', 'Title', { duration: 3000, closable: false });

            expect(mockContainer.addToast).toHaveBeenCalledWith({
                type: 'success',
                message: 'Success message',
                title: 'Title',
                duration: 3000,
                closable: false
            });
        });

        it('should not throw error if container is not available', () => {
            delete (window as any).toastContainer;

            expect(() => service.success('Message')).not.toThrow();
        });
    });

    describe('error Method', () => {
        it('should call addToast with error configuration', () => {
            service.error('Error message', 'Error Title');

            expect(mockContainer.addToast).toHaveBeenCalledWith({
                type: 'error',
                message: 'Error message',
                title: 'Error Title',
                duration: 7000,
                closable: true
            });
        });

        it('should call addToast with error configuration without title', () => {
            service.error('Error message');

            expect(mockContainer.addToast).toHaveBeenCalledWith({
                type: 'error',
                message: 'Error message',
                title: undefined,
                duration: 7000,
                closable: true
            });
        });

        it('should merge custom options with error defaults', () => {
            service.error('Error message', 'Title', { duration: 10000 });

            expect(mockContainer.addToast).toHaveBeenCalledWith({
                type: 'error',
                message: 'Error message',
                title: 'Title',
                duration: 10000,
                closable: true
            });
        });

        it('should have longer duration than success (7000ms)', () => {
            service.error('Error message');

            const callArgs = mockContainer.addToast.calls.mostRecent().args[0];
            expect(callArgs.duration).toBe(7000);
        });
    });

    describe('warning Method', () => {
        it('should call addToast with warning configuration', () => {
            service.warning('Warning message', 'Warning Title');

            expect(mockContainer.addToast).toHaveBeenCalledWith({
                type: 'warning',
                message: 'Warning message',
                title: 'Warning Title',
                duration: 6000,
                closable: true
            });
        });

        it('should call addToast with warning configuration without title', () => {
            service.warning('Warning message');

            expect(mockContainer.addToast).toHaveBeenCalledWith({
                type: 'warning',
                message: 'Warning message',
                title: undefined,
                duration: 6000,
                closable: true
            });
        });

        it('should merge custom options with warning defaults', () => {
            service.warning('Warning message', 'Title', { closable: false });

            expect(mockContainer.addToast).toHaveBeenCalledWith({
                type: 'warning',
                message: 'Warning message',
                title: 'Title',
                duration: 6000,
                closable: false
            });
        });
    });

    describe('info Method', () => {
        it('should call addToast with info configuration', () => {
            service.info('Info message', 'Info Title');

            expect(mockContainer.addToast).toHaveBeenCalledWith({
                type: 'info',
                message: 'Info message',
                title: 'Info Title',
                duration: 5000,
                closable: true
            });
        });

        it('should call addToast with info configuration without title', () => {
            service.info('Info message');

            expect(mockContainer.addToast).toHaveBeenCalledWith({
                type: 'info',
                message: 'Info message',
                title: undefined,
                duration: 5000,
                closable: true
            });
        });

        it('should merge custom options with info defaults', () => {
            service.info('Info message', 'Title', { duration: 8000 });

            expect(mockContainer.addToast).toHaveBeenCalledWith({
                type: 'info',
                message: 'Info message',
                title: 'Title',
                duration: 8000,
                closable: true
            });
        });
    });

    describe('custom Method', () => {
        it('should call addToast with custom configuration', () => {
            const customConfig: ToastConfig = {
                type: 'success',
                message: 'Custom message',
                title: 'Custom Title',
                duration: 10000,
                closable: false
            };

            service.custom(customConfig);

            expect(mockContainer.addToast).toHaveBeenCalledWith({
                type: 'success',
                message: 'Custom message',
                title: 'Custom Title',
                duration: 10000,
                closable: false
            });
        });

        it('should merge custom config with defaults', () => {
            const customConfig: ToastConfig = {
                type: 'warning',
                message: 'Custom message'
            };

            service.custom(customConfig);

            expect(mockContainer.addToast).toHaveBeenCalledWith({
                type: 'warning',
                message: 'Custom message',
                duration: 5000,
                closable: true
            });
        });

        it('should allow overriding default duration and closable', () => {
            const customConfig: ToastConfig = {
                type: 'info',
                message: 'Message',
                duration: 15000,
                closable: false
            };

            service.custom(customConfig);

            const callArgs = mockContainer.addToast.calls.mostRecent().args[0];
            expect(callArgs.duration).toBe(15000);
            expect(callArgs.closable).toBe(false);
        });
    });

    describe('clearAll Method', () => {
        it('should call clearAllToasts on container', () => {
            service.clearAll();

            expect(mockContainer.clearAllToasts).toHaveBeenCalled();
        });

        it('should not throw error if container is not available', () => {
            delete (window as any).toastContainer;

            expect(() => service.clearAll()).not.toThrow();
        });

        it('should not call clearAllToasts if container is undefined', () => {
            delete (window as any).toastContainer;

            service.clearAll();

            expect(mockContainer.clearAllToasts).not.toHaveBeenCalled();
        });
    });

    describe('Toast Duration Consistency', () => {
        it('should have different durations for different toast types', () => {
            service.success('Success');
            const successDuration = mockContainer.addToast.calls.mostRecent().args[0].duration;

            service.error('Error');
            const errorDuration = mockContainer.addToast.calls.mostRecent().args[0].duration;

            service.warning('Warning');
            const warningDuration = mockContainer.addToast.calls.mostRecent().args[0].duration;

            service.info('Info');
            const infoDuration = mockContainer.addToast.calls.mostRecent().args[0].duration;

            expect(successDuration).toBe(5000);
            expect(errorDuration).toBe(7000);
            expect(warningDuration).toBe(6000);
            expect(infoDuration).toBe(5000);
        });
    });

    describe('Integration Tests', () => {
        it('should show multiple toasts in sequence', () => {
            service.success('First message');
            service.error('Second message');
            service.warning('Third message');

            expect(mockContainer.addToast).toHaveBeenCalledTimes(3);
        });

        it('should clear all toasts after showing multiple', () => {
            service.success('Message 1');
            service.error('Message 2');
            service.clearAll();

            expect(mockContainer.clearAllToasts).toHaveBeenCalled();
        });

        it('should handle container becoming unavailable gracefully', () => {
            service.success('Message 1');
            expect(mockContainer.addToast).toHaveBeenCalledTimes(1);

            delete (window as any).toastContainer;

            expect(() => {
                service.success('Message 2');
                service.clearAll();
            }).not.toThrow();

            // Should still be 1 call from before container was removed
            expect(mockContainer.addToast).toHaveBeenCalledTimes(1);
        });
    });
});

