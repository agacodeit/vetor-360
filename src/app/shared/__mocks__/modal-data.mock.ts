/**
 * Mock de dados de modais para testes
 */

import { ModalConfig } from '../services/modal/modal.service';

/**
 * Configuração básica de modal
 */
export const MOCK_MODAL_CONFIG: ModalConfig = {
    id: 'test-modal',
    title: 'Test Modal'
};

/**
 * Configuração completa de modal
 */
export const MOCK_COMPLETE_MODAL_CONFIG: ModalConfig = {
    id: 'complete-modal',
    title: 'Complete Modal',
    showHeader: true,
    showCloseButton: true,
    closeOnBackdropClick: true,
    closeOnEscapeKey: true,
    size: 'md'
};

/**
 * Configuração de modal grande
 */
export const MOCK_LARGE_MODAL_CONFIG: ModalConfig = {
    id: 'large-modal',
    title: 'Large Modal',
    size: 'lg'
};

/**
 * Configuração de modal pequeno
 */
export const MOCK_SMALL_MODAL_CONFIG: ModalConfig = {
    id: 'small-modal',
    title: 'Small Modal',
    size: 'sm'
};

/**
 * Configuração de modal sem header
 */
export const MOCK_NO_HEADER_MODAL_CONFIG: ModalConfig = {
    id: 'no-header-modal',
    showHeader: false,
    showCloseButton: false
};

/**
 * Configuração de modal com dados customizados
 */
export const MOCK_MODAL_WITH_DATA: ModalConfig = {
    id: 'data-modal',
    title: 'Modal with Data',
    data: {
        userId: 123,
        name: 'Test User',
        action: 'edit'
    }
};

