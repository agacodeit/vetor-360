/**
 * Mock de dados de toasts para testes
 */

import { ToastConfig } from '../components/atoms/toast/toast.component';

/**
 * Interface para o mock do toast container
 * Usa 'any' para evitar dependência dos tipos do Jasmine
 */
export interface MockToastContainer {
    addToast: any;
    clearAllToasts: any;
}

/**
 * Helper para criar o mock do toast container
 * Use esta função no beforeEach dos seus testes
 * 
 * @example
 * ```typescript
 * let mockContainer: MockToastContainer;
 * 
 * beforeEach(() => {
 *   mockContainer = createMockToastContainer();
 * });
 * ```
 */
export function createMockToastContainer(): MockToastContainer {
    // Acessa jasmine em runtime (disponível em testes)
    const jasmineGlobal = (globalThis as any).jasmine;
    return {
        addToast: jasmineGlobal.createSpy('addToast'),
        clearAllToasts: jasmineGlobal.createSpy('clearAllToasts')
    };
}

/**
 * Configuração de toast de sucesso
 */
export const MOCK_SUCCESS_TOAST: ToastConfig = {
    type: 'success',
    message: 'Operação realizada com sucesso',
    title: 'Sucesso',
    duration: 5000,
    closable: true
};

/**
 * Configuração de toast de erro
 */
export const MOCK_ERROR_TOAST: ToastConfig = {
    type: 'error',
    message: 'Ocorreu um erro na operação',
    title: 'Erro',
    duration: 7000,
    closable: true
};

/**
 * Configuração de toast de aviso
 */
export const MOCK_WARNING_TOAST: ToastConfig = {
    type: 'warning',
    message: 'Atenção: verifique os dados',
    title: 'Aviso',
    duration: 6000,
    closable: true
};

/**
 * Configuração de toast de informação
 */
export const MOCK_INFO_TOAST: ToastConfig = {
    type: 'info',
    message: 'Informação importante',
    title: 'Info',
    duration: 5000,
    closable: true
};

/**
 * Configuração de toast customizado
 */
export const MOCK_CUSTOM_TOAST: ToastConfig = {
    type: 'success',
    message: 'Toast customizado',
    title: 'Custom',
    duration: 10000,
    closable: false
};

/**
 * Helper para configurar o mock do toast container no window
 * Use no beforeEach dos seus testes
 * 
 * @example
 * ```typescript
 * let mockContainer: MockToastContainer;
 * 
 * beforeEach(() => {
 *   mockContainer = setupToastContainerMock();
 * });
 * ```
 */
export function setupToastContainerMock(): MockToastContainer {
    const mockContainer = createMockToastContainer();
    (window as any).toastContainer = mockContainer;
    return mockContainer;
}

/**
 * Helper para limpar o mock do toast container
 * Use no afterEach dos seus testes
 * 
 * @example
 * ```typescript
 * afterEach(() => {
 *   cleanupToastContainerMock();
 * });
 * ```
 */
export function cleanupToastContainerMock(): void {
    delete (window as any).toastContainer;
}

