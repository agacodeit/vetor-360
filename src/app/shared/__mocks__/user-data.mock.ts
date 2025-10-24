/**
 * Mock de dados de usuários para testes
 */

import { UserProfile } from '../types/profile.types';

/**
 * Usuário Gestor AcesseBank
 */
export const MOCK_GESTOR_USER = {
    id: '96b47879-5edb-425b-8d4e-583856490872',
    email: 'gestor@acessebank.com.br',
    name: 'João Silva (Gestor)',
    userTypeEnum: UserProfile.GESTOR_ACESSEBANK,
    cpfCnpj: '12345678901',
    cellphone: '11999999999',
    comercialPhone: '1133333333',
    userStatusEnum: 'ACTIVE' as const,
    dateHourIncluded: '2024-02-05 23:05:00',
    documents: [
        {
            id: '031012a1-513f-4f83-a2b4-3bf43d12d408',
            description: 'Documento de Identificação',
            initialDocument: true,
            files: [
                {
                    id: '307df1cf-2f1d-46dc-baea-a38a2efe3b96',
                    fileName: 'RG_Gestor.pdf',
                    code: '2dab3f26-558b-4a38-99ff-0242d6e50c5b',
                    opportunityId: '031012a1-513f-4f83-a2b4-3bf43d12d408',
                    documentId: '031012a1-513f-4f83-a2b4-3bf43d12d408',
                    dateHourIncluded: '2024-03-06T14:56:11.028-03:00',
                    userIncludedId: '96b47879-5edb-425b-8d4e-583856490872',
                    urlDownload: 'https://download.acessebank.com.br/documents/rg_gestor.pdf',
                    active: true
                }
            ],
            dateHourIncluded: '2024-02-05 23:05:00',
            userIncludedId: '96b47879-5edb-425b-8d4e-583856490872',
            documentStatusEnum: 'COMPLETED' as const,
            comments: []
        }
    ],
    temporaryPass: false,
    masterAccessGrantedEnum: 'APPROVED' as const,
    notifyClientsByEmail: true,
    authorized: true
};

/**
 * Usuário Parceiro AcesseBank
 */
export const MOCK_PARCEIRO_USER = {
    id: '96b47879-5edb-425b-8d4e-583856490872',
    email: 'parceiro@acessebank.com.br',
    name: 'Maria Santos (Parceiro)',
    userTypeEnum: UserProfile.PARCEIRO_ACESSEBANK,
    cpfCnpj: '51392619000120',
    cellphone: '99999999999',
    comercialPhone: '99999999999',
    userStatusEnum: 'ACTIVE' as const,
    dateHourIncluded: '2024-02-05 23:05:00',
    documents: [
        {
            id: '031012a1-513f-4f83-a2b4-3bf43d12d408',
            description: 'Documento de Identificação',
            initialDocument: true,
            files: [
                {
                    id: '307df1cf-2f1d-46dc-baea-a38a2efe3b96',
                    fileName: 'RG_Parceiro.pdf',
                    code: '2dab3f26-558b-4a38-99ff-0242d6e50c5b',
                    opportunityId: '031012a1-513f-4f83-a2b4-3bf43d12d408',
                    documentId: '031012a1-513f-4f83-a2b4-3bf43d12d408',
                    dateHourIncluded: '2024-03-06T14:56:11.028-03:00',
                    userIncludedId: '96b47879-5edb-425b-8d4e-583856490872',
                    urlDownload: 'https://download.acessebank.com.br/documents/rg_parceiro.pdf',
                    active: true
                }
            ],
            dateHourIncluded: '2024-02-05 23:05:00',
            userIncludedId: '96b47879-5edb-425b-8d4e-583856490872',
            documentStatusEnum: 'COMPLETED' as const,
            comments: []
        }
    ],
    temporaryPass: false,
    masterAccessGrantedEnum: 'APPROVED' as const,
    notifyClientsByEmail: true,
    authorized: true
};

/**
 * Usuário Gestor com senha temporária
 */
export const MOCK_GESTOR_TEMP_PASS = {
    ...MOCK_GESTOR_USER,
    id: '96b47879-5edb-425b-8d4e-583856490873',
    email: 'gestor.temp@acessebank.com.br',
    name: 'Carlos Silva (Gestor - Senha Temp)',
    temporaryPass: true,
    masterAccessGrantedEnum: 'PENDING' as const
};

/**
 * Usuário Parceiro não autorizado
 */
export const MOCK_PARCEIRO_UNAUTHORIZED = {
    ...MOCK_PARCEIRO_USER,
    id: '96b47879-5edb-425b-8d4e-583856490874',
    email: 'parceiro.pending@acessebank.com.br',
    name: 'Ana Santos (Parceiro - Pendente)',
    userStatusEnum: 'PENDING' as const,
    authorized: false,
    masterAccessGrantedEnum: 'PENDING' as const
};

/**
 * Usuário com status inativo
 */
export const MOCK_USER_INACTIVE = {
    ...MOCK_GESTOR_USER,
    id: '96b47879-5edb-425b-8d4e-583856490875',
    email: 'inactive@acessebank.com.br',
    name: 'Pedro Silva (Inativo)',
    userStatusEnum: 'INACTIVE' as const,
    authorized: false
};

/**
 * Usuário para testes de login
 */
export const MOCK_LOGIN_CREDENTIALS = {
    gestor: {
        email: 'gestor@acessebank.com.br',
        password: 'senha123'
    },
    parceiro: {
        email: 'parceiro@acessebank.com.br',
        password: 'senha123'
    }
};

/**
 * Resposta de login mock (estrutura alternativa)
 */
export const MOCK_LOGIN_RESPONSES = {
    gestor: {
        token: 'mock-bearer-token-gestor-12345',
        user: MOCK_GESTOR_USER,
        expiresIn: 3600
    },
    parceiro: {
        token: 'mock-bearer-token-parceiro-12345',
        user: MOCK_PARCEIRO_USER,
        expiresIn: 3600
    }
};

