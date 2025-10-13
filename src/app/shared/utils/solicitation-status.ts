/**
 * 📋 ENUM DE STATUS DAS SOLICITAÇÕES
 * Define os possíveis status de uma solicitação no kanban
 */
export enum SolicitationStatus {
    PENDING_DOCUMENTS = 'pending-documents',
    IN_ANALYSIS = 'in-analysis',
    NEGOTIATION = 'negotiation',
    WAITING_PAYMENT = 'waiting-payment',
    RELEASED_RESOURCES = 'released-resources',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    CANCELLED = 'cancelled'
}

/**
 * 🌍 TRADUÇÕES DOS STATUS
 * Mapeamento de status para seus labels em português
 */
const STATUS_LABELS: Record<SolicitationStatus, string> = {
    [SolicitationStatus.PENDING_DOCUMENTS]: 'Pendente de documentos',
    [SolicitationStatus.IN_ANALYSIS]: 'Em análise',
    [SolicitationStatus.NEGOTIATION]: 'Em negociação',
    [SolicitationStatus.WAITING_PAYMENT]: 'Aguardando pagamento',
    [SolicitationStatus.RELEASED_RESOURCES]: 'Recursos liberados',
    [SolicitationStatus.APPROVED]: 'Aprovado',
    [SolicitationStatus.REJECTED]: 'Rejeitado',
    [SolicitationStatus.CANCELLED]: 'Cancelado'
};

/**
 * 📊 UTILIDADES PARA STATUS DE SOLICITAÇÕES
 */
export class SolicitationStatusUtil {
    /**
     * Traduz um status para português
     * @param status Status da solicitação
     * @returns Label em português
     */
    static getLabel(status: string): string {
        return STATUS_LABELS[status as SolicitationStatus] || status;
    }


    /**
     * Obtém todos os status disponíveis
     * @returns Array com todos os status
     */
    static getAllStatuses(): SolicitationStatus[] {
        return Object.values(SolicitationStatus);
    }
}

