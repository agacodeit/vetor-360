import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserProfile, ProfileConfig, User, ProfilePermission } from '../../types/profile.types';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    // Signal-based approach for reactive programming
    private currentUserSignal = signal<User | null>(null);
    public currentUser = this.currentUserSignal.asReadonly();

    // Computed signal for current profile
    public currentProfile = computed(() => this.currentUser()?.userTypeEnum || null);

    // Storage Configuration
    private readonly USER_STORAGE_KEY = 'currentUser';

    private profileConfigs: ProfileConfig[] = [
        {
            profile: UserProfile.GESTOR_ACESSEBANK,
            description: 'Gestor com acesso completo ao sistema',
            permissions: [
                { component: 'dashboard', action: 'view' },
                { component: 'reports', action: 'view' },
                { component: 'reports', action: 'export' },
                { component: 'users', action: 'manage' },
                { component: 'settings', action: 'view' },
                { component: 'settings', action: 'edit' },
                { component: 'analytics', action: 'view' },
                { component: 'financial', action: 'view' },
                { component: 'financial', action: 'export' }
            ]
        },
        {
            profile: UserProfile.PARCEIRO_ACESSEBANK,
            description: 'Parceiro com acesso limitado',
            permissions: [
                { component: 'dashboard', action: 'view' },
                { component: 'reports', action: 'view' },
                { component: 'profile', action: 'view' },
                { component: 'profile', action: 'edit' }
            ]
        }
    ];

    constructor() {
        // Load user from localStorage on service initialization
        this.loadUserFromStorage();
    }

    /**
     * Set the current user and save to localStorage
     */
    setCurrentUser(user: User): void {
        this.currentUserSubject.next(user);
        this.currentUserSignal.set(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    /**
     * Get the current user
     */
    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    /**
     * Clear the current user
     */
    clearCurrentUser(): void {
        this.currentUserSubject.next(null);
        this.currentUserSignal.set(null);
        localStorage.removeItem('currentUser');
    }

    /**
     * Check if user has permission for a specific component/action
     */
    hasPermission(component: string, action?: string): boolean {
        const user = this.getCurrentUser();
        if (!user) return false;

        const profileConfig = this.profileConfigs.find(config => config.profile === user.userTypeEnum);
        if (!profileConfig) return false;

        return profileConfig.permissions.some(permission => {
            const componentMatch = permission.component === component;
            const actionMatch = !action || !permission.action || permission.action === action;
            const conditionMatch = !permission.condition || permission.condition(user);

            return componentMatch && actionMatch && conditionMatch;
        });
    }

    /**
     * Check if user has any of the specified permissions
     */
    hasAnyPermission(permissions: Array<{ component: string, action?: string }>): boolean {
        return permissions.some(permission =>
            this.hasPermission(permission.component, permission.action)
        );
    }

    /**
     * Check if user has all of the specified permissions
     */
    hasAllPermissions(permissions: Array<{ component: string, action?: string }>): boolean {
        return permissions.every(permission =>
            this.hasPermission(permission.component, permission.action)
        );
    }

    /**
     * Check if user can access a specific route
     */
    canAccessRoute(route: string): boolean {
        const user = this.getCurrentUser();
        if (!user) return false;

        const profileConfig = this.profileConfigs.find(config => config.profile === user.userTypeEnum);
        if (!profileConfig) return false;

        return profileConfig.permissions.some(permission =>
            permission.route === route || permission.component === route
        );
    }

    /**
     * Get all permissions for current user
     */
    getCurrentUserPermissions(): ProfilePermission[] {
        const user = this.getCurrentUser();
        if (!user) return [];

        const profileConfig = this.profileConfigs.find(config => config.profile === user.userTypeEnum);
        return profileConfig?.permissions || [];
    }

    /**
     * Get profile configuration for a specific profile
     */
    getProfileConfig(profile: UserProfile): ProfileConfig | undefined {
        return this.profileConfigs.find(config => config.profile === profile);
    }

    /**
     * Add custom permission to current user
     */
    addCustomPermission(component: string, action?: string, condition?: (user: User) => boolean): void {
        const user = this.getCurrentUser();
        if (!user) return;

        if (!user.permissions) {
            user.permissions = [];
        }

        const permissionKey = `${component}${action ? `:${action}` : ''}`;
        if (!user.permissions.includes(permissionKey)) {
            user.permissions.push(permissionKey);
            this.setCurrentUser(user);
        }
    }

    /**
     * Remove custom permission from current user
     */
    removeCustomPermission(component: string, action?: string): void {
        const user = this.getCurrentUser();
        if (!user || !user.permissions) return;

        const permissionKey = `${component}${action ? `:${action}` : ''}`;
        user.permissions = user.permissions.filter(p => p !== permissionKey);
        this.setCurrentUser(user);
    }

    /**
     * Load user from localStorage
     */
    private loadUserFromStorage(): void {
        try {
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                this.currentUserSubject.next(user);
                this.currentUserSignal.set(user);
            }
        } catch (error) {
            console.error('Error loading user from storage:', error);
            localStorage.removeItem('currentUser');
        }
    }

    /**
     * Check if current user is authenticated
     */
    isAuthenticated(): boolean {
        return this.getCurrentUser() !== null;
    }

    /**
     * Get user profile as observable
     */
    getCurrentProfile$(): Observable<UserProfile | null> {
        return new Observable(observer => {
            this.currentUser$.subscribe(user => {
                observer.next(user?.userTypeEnum || null);
            });
        });
    }

}
