/**
 * Mock de dados do Kanban para testes
 */

import { KanbanCard, KanbanColumn } from '../components/organisms/kanban/kanban.component';

/**
 * Card de kanban básico
 */
export const MOCK_KANBAN_CARD: KanbanCard = {
    id: '1',
    title: 'Solicitação de Teste',
    status: 'in-analysis',
    client: 'Cliente Teste',
    cnpj: '11.222.333/0001-44',
    dueDate: new Date()
};

/**
 * Card de kanban com dados completos
 */
export const MOCK_COMPLETE_KANBAN_CARD: KanbanCard = {
    id: '1',
    title: 'Solicitação Completa',
    status: 'in-analysis',
    client: 'Cliente Teste S.A.',
    cnpj: '11.222.333/0001-44',
    dueDate: new Date('2025-01-15T10:00:00Z'),
    description: 'Descrição da solicitação',
    priority: 'high'
};

/**
 * Lista de cards para testes
 */
export const MOCK_KANBAN_CARDS: KanbanCard[] = [
    {
        id: '1',
        title: 'Solicitação 1',
        status: 'pending',
        client: 'Cliente A',
        cnpj: '11.111.111/0001-11'
    },
    {
        id: '2',
        title: 'Solicitação 2',
        status: 'in-analysis',
        client: 'Cliente B',
        cnpj: '22.222.222/0001-22'
    },
    {
        id: '3',
        title: 'Solicitação 3',
        status: 'approved',
        client: 'Cliente C',
        cnpj: '33.333.333/0001-33'
    }
];

/**
 * Coluna de kanban básica
 */
export const MOCK_KANBAN_COLUMN: KanbanColumn = {
    id: 'pending',
    title: 'Pendente',
    cards: []
};

/**
 * Colunas de kanban padrão
 */
export const MOCK_KANBAN_COLUMNS: KanbanColumn[] = [
    {
        id: 'pending',
        title: 'Pendente',
        cards: []
    },
    {
        id: 'in-analysis',
        title: 'Em Análise',
        cards: []
    },
    {
        id: 'approved',
        title: 'Aprovado',
        cards: []
    },
    {
        id: 'rejected',
        title: 'Rejeitado',
        cards: []
    }
];

