import { UserProfile, ProfileConfig } from '../types/profile.types';

/**
 * Configuration file for profile permissions
 * This file centralizes all permission mappings for different user profiles
 */

export const PROFILE_PERMISSIONS_CONFIG: ProfileConfig[] = [
    {
        profile: UserProfile.GESTOR_ACESSEBANK,
        description: 'Gestor com acesso completo ao sistema AcesseBank',
        permissions: [
            // Dashboard and navigation
            { component: 'dashboard', action: 'view' },
            { component: 'navigation', action: 'view' },

            // Reports and analytics
            { component: 'reports', action: 'view' },
            { component: 'reports', action: 'export' },
            { component: 'reports', action: 'print' },
            { component: 'analytics', action: 'view' },
            { component: 'analytics', action: 'export' },

            // User management
            { component: 'users', action: 'view' },
            { component: 'users', action: 'create' },
            { component: 'users', action: 'edit' },
            { component: 'users', action: 'delete' },
            { component: 'users', action: 'manage' },

            // Settings and configuration
            { component: 'settings', action: 'view' },
            { component: 'settings', action: 'edit' },
            { component: 'settings', action: 'delete' },

            // Financial operations
            { component: 'financial', action: 'view' },
            { component: 'financial', action: 'export' },
            { component: 'financial', action: 'approve' },
            { component: 'transactions', action: 'view' },
            { component: 'transactions', action: 'export' },

            // Partner management
            { component: 'partners', action: 'view' },
            { component: 'partners', action: 'manage' },
            { component: 'partners', action: 'approve' },

            // Notifications
            { component: 'notifications', action: 'view' },
            { component: 'notifications', action: 'send' },

            // System administration
            { component: 'logs', action: 'view' },
            { component: 'audit', action: 'view' }
        ]
    },
    {
        profile: UserProfile.PARCEIRO_ACESSEBANK,
        description: 'Parceiro com acesso limitado ao sistema',
        permissions: [
            // Dashboard and navigation
            { component: 'dashboard', action: 'view' },
            { component: 'navigation', action: 'view' },

            // Limited reports
            { component: 'reports', action: 'view' },
            { component: 'reports', action: 'export' },

            // Own profile management
            { component: 'profile', action: 'view' },
            { component: 'profile', action: 'edit' },

            // Limited financial access
            { component: 'financial', action: 'view' },
            { component: 'transactions', action: 'view' },

            // Notifications
            { component: 'notifications', action: 'view' }
        ]
    }
];

/**
 * Route-based permissions configuration
 * Maps routes to required permissions
 * Only includes routes that exist in the project
 */
export const ROUTE_PERMISSIONS_CONFIG = {
    '/authorized/dashboard': {
        requiredPermissions: [{ component: 'dashboard', action: 'view' }]
    }
};

/**
 * Component-based permissions configuration
 * Maps components to required permissions
 */
export const COMPONENT_PERMISSIONS_CONFIG = {
    'user-management': {
        requiredPermissions: [{ component: 'users', action: 'manage' }]
    },
    'financial-dashboard': {
        requiredPermissions: [{ component: 'financial', action: 'view' }]
    },
    'reports-export': {
        requiredPermissions: [{ component: 'reports', action: 'export' }]
    },
    'admin-panel': {
        requiredPermissions: [{ component: 'admin', action: 'manage' }]
    },
    'partner-management': {
        requiredPermissions: [{ component: 'partners', action: 'manage' }]
    }
};

/**
 * Helper functions for permission checking
 */
export class ProfilePermissionHelper {
    /**
     * Check if a profile has access to a specific component/action
     */
    static hasAccess(profile: UserProfile, component: string, action?: string): boolean {
        const profileConfig = PROFILE_PERMISSIONS_CONFIG.find(config => config.profile === profile);
        if (!profileConfig) return false;

        return profileConfig.permissions.some(permission => {
            const componentMatch = permission.component === component;
            const actionMatch = !action || !permission.action || permission.action === action;
            return componentMatch && actionMatch;
        });
    }

    /**
     * Get all permissions for a specific profile
     */
    static getPermissionsForProfile(profile: UserProfile): string[] {
        const profileConfig = PROFILE_PERMISSIONS_CONFIG.find(config => config.profile === profile);
        if (!profileConfig) return [];

        return profileConfig.permissions.map(permission =>
            `${permission.component}${permission.action ? `:${permission.action}` : ''}`
        );
    }

    /**
     * Check if a profile can access a specific route
     */
    static canAccessRoute(profile: UserProfile, route: string): boolean {
        const routeConfig = ROUTE_PERMISSIONS_CONFIG[route as keyof typeof ROUTE_PERMISSIONS_CONFIG];
        if (!routeConfig) return true; // If no config, allow access

        return routeConfig.requiredPermissions.every(permission =>
            this.hasAccess(profile, permission.component, permission.action)
        );
    }
}
