// Simplified status colors utility - models removed

export type BadgeColor = 'green' | 'yellow' | 'orange' | 'red' | 'blue' | 'purple' | 'gray';

// Basic status types since models were removed
export type StatusType = string;

/**
 * 🎨 MAPEAMENTO DE CORES POR STATUS
 * Define cores consistentes para cada status do sistema
 */
export class StatusColors {

    /**
     * 🎨 CORES BÁSICAS POR STATUS
     * Mapeamento genérico de cores para status
     */
    private static readonly BASIC_COLORS: Record<string, BadgeColor> = {
        'ACTIVE': 'green',
        'INACTIVE': 'gray',
        'PENDING': 'yellow',
        'APPROVED': 'green',
        'REJECTED': 'red',
        'CANCELLED': 'red',
        'COMPLETED': 'green',
        'IN_PROGRESS': 'blue',
        'WAITING': 'orange',
        'ERROR': 'red',
        'SUCCESS': 'green',
        'WARNING': 'yellow',
        'INFO': 'blue'
    };

    /**
     * 🎯 OBTÉM COR DO STATUS
     * Retorna a cor apropriada para um status específico
     */
    static getStatusColor(status: string): BadgeColor {
        return this.BASIC_COLORS[status.toUpperCase()] || 'gray';
    }

    /**
     * 🎨 OBTÉM CORES DISPONÍVEIS
     * Retorna todas as cores disponíveis para badges
     */
    static getAvailableColors(): BadgeColor[] {
        return ['green', 'yellow', 'orange', 'red', 'blue', 'purple', 'gray'];
    }
}