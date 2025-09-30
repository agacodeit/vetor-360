import { ListViewConfig } from "../../models/list-view/list-view";
import { ViewMode } from "../../models/list-view/list-view";

export class ListViewUtils {

    /**
     * Gera configuração padrão baseada no tipo de entidade
     */
    static getDefaultConfig(entityType: string): ListViewConfig {
        const configs: { [key: string]: ListViewConfig } = {
            'developments': {
                cardConfig: { minWidth: '350px', gap: '24px' },
                defaultView: ViewMode.TABLE
            },
            'production-sheets': {
                cardConfig: { minWidth: '320px', gap: '20px' },
                defaultView: ViewMode.CARD
            },
            'clients': {
                cardConfig: { columns: 3, gap: '16px' },
                defaultView: ViewMode.TABLE
            },
            'orders': {
                cardConfig: { minWidth: '300px', gap: '20px' },
                defaultView: ViewMode.TABLE
            }
        };

        return {
            showToggle: true,
            storageKey: `${entityType}-view-mode`,
            density: 'normal',
            ...configs[entityType]
        };
    }

    /**
     * Responsividade automática - força cards em mobile
     */
    static getResponsiveViewMode(preferredMode: ViewMode): ViewMode {
        const isMobile = window.innerWidth < 768;
        return isMobile ? ViewMode.CARD : preferredMode;
    }

    /**
     * Tracking de analytics unificado
     */
    static trackViewChange(entityType: string, mode: ViewMode, analytics?: any) {
        if (analytics?.track) {
            analytics.track('list_view_changed', {
                entity_type: entityType,
                view_mode: mode,
                timestamp: new Date().toISOString()
            });
        }
    }
}
