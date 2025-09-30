export interface ListViewConfig {
    items?: any[];
    totalItems?: number;
    pageSize?: number;
    currentPage?: number;
    loading?: boolean;
    error?: string;
    searchTerm?: string;
    sortField?: string;
    sortDirection?: 'asc' | 'desc';
    filters?: Record<string, any>;
    showToggle?: boolean;
    defaultView?: ViewMode;
    storageKey?: string;
    density?: 'compact' | 'normal' | 'comfortable';
    cardConfig?: {
        minWidth?: string;
        gap?: string;
        columns?: number;
    };
}

export interface ListViewColumn {
    key: string;
    label: string;
    sortable?: boolean;
    filterable?: boolean;
    width?: string;
    align?: 'left' | 'center' | 'right';
    render?: (value: any, item: any) => string;
}

export interface ListViewAction {
    label: string;
    icon?: string;
    action: (item: any) => void;
    visible?: (item: any) => boolean;
    disabled?: (item: any) => boolean;
    variant?: 'primary' | 'secondary' | 'danger' | 'warning';
}

export enum ViewMode {
    TABLE = 'table',
    CARD = 'card',
    LIST = 'list'
}
