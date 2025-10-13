/**
 * Exports centralizados de todos os mocks
 * 
 * Facilita a importação de mocks em testes:
 * 
 * @example
 * ```typescript
 * import { 
 *   VALID_JWT_TOKEN, 
 *   MOCK_USER, 
 *   MOCK_LOGIN_REQUEST,
 *   MockToastContainer,
 *   setupToastContainerMock 
 * } from '../../shared/__mocks__';
 * ```
 */

// JWT Tokens
export * from './jwt-tokens.mock';

// User Data
export * from './user-data.mock';

// Auth Requests
export * from './auth-requests.mock';

// Kanban Data
export * from './kanban-data.mock';

// Modal Data
export * from './modal-data.mock';

// Toast Data (includes helper functions and types)
export * from './toast-data.mock';

