import { ListViewConfig } from "../../models/list-view/list-view";
import { ViewMode } from "../../models/list-view/list-view";

export interface ListViewMixin {
    listViewConfig: ListViewConfig;
    currentViewMode: ViewMode;
    onViewModeChange(mode: ViewMode): void;
}

export function createListViewMixin(
    storageKey: string,
    defaultConfig: Partial<ListViewConfig> = {}
): Partial<ListViewMixin> {
    return {
        listViewConfig: {
            showToggle: true,
            defaultView: ViewMode.TABLE,
            storageKey,
            ...defaultConfig
        },

        onViewModeChange(mode: ViewMode) {
            localStorage.setItem(`${storageKey}-view-mode`, mode);

        }
    };
}
