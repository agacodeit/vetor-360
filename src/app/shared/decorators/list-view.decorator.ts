import { ListViewConfig } from "../../models/list-view/list-view";
import { ViewMode } from "../../models/list-view/list-view";
import { ListViewUtils } from "../utils/list-view";

export function WithListView(entityType: string, config?: Partial<ListViewConfig>) {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
            listViewConfig: ListViewConfig;
            currentViewMode: ViewMode = ViewMode.TABLE;

            constructor(...args: any[]) {
                super(...args);

                this.listViewConfig = {
                    ...ListViewUtils.getDefaultConfig(entityType),
                    ...config
                };


                const saved = localStorage.getItem(`${entityType}-view-mode`) as ViewMode;
                if (saved) {
                    this.currentViewMode = saved;
                }
            }

            onViewModeChange(mode: ViewMode) {
                this.currentViewMode = mode;
                localStorage.setItem(`${entityType}-view-mode`, mode);
                ListViewUtils.trackViewChange(entityType, mode);
            }
        };
    };
}
