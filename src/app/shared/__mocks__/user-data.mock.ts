/**
 * Mock de dados de usuários para testes
 */

/**
 * Usuário de teste padrão
 */
export const MOCK_USER = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    roles: ['USER']
};

/**
 * Usuário com múltiplas roles
 */
export const MOCK_ADMIN_USER = {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    roles: ['USER', 'ADMIN']
};

/**
 * Usuário com roles de editor
 */
export const MOCK_EDITOR_USER = {
    id: '2',
    email: 'editor@example.com',
    name: 'Editor User',
    roles: ['USER', 'EDITOR']
};

/**
 * Usuário com múltiplas roles (completo)
 */
export const MOCK_MULTI_ROLE_USER = {
    id: '3',
    email: 'multi@example.com',
    name: 'Multi Role User',
    roles: ['USER', 'ADMIN', 'EDITOR', 'MODERATOR']
};

/**
 * Usuário sem roles
 */
export const MOCK_USER_NO_ROLES = {
    id: '4',
    email: 'noroles@example.com',
    name: 'No Roles User'
};

/**
 * Novo usuário para signup
 */
export const MOCK_NEW_USER = {
    id: '2',
    email: 'newuser@example.com',
    name: 'New User'
};

