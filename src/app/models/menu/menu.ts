export interface MenuItem {
    id: string;
    label: string;
    icon?: string;
    route?: string;
    action?: () => void;
    children?: MenuItem[];
    disabled?: boolean;
    visible?: boolean;
    badge?: string;
    badgeColor?: string;
}

export interface MenuConfig {
    items: MenuItem[];
    orientation?: 'horizontal' | 'vertical';
    theme?: 'light' | 'dark';
}
