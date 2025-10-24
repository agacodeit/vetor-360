import { Pipe, PipeTransform } from '@angular/core';
import { ProfileService } from '../services/profile/profile.service';
import { UserProfile } from '../types/profile.types';

@Pipe({
    name: 'profile',
    standalone: true,
    pure: false // Make it impure to react to service changes
})
export class ProfilePipe implements PipeTransform {

    constructor(private profileService: ProfileService) { }

    transform(
        value: any,
        type: 'hasPermission' | 'hasProfile' | 'canAccess' | 'getProfile' = 'hasPermission',
        component?: string,
        action?: string,
        profiles?: UserProfile | UserProfile[]
    ): boolean | UserProfile | null {

        switch (type) {
            case 'hasPermission':
                return this.profileService.hasPermission(component || '', action);

            case 'hasProfile':
                if (!profiles) return false;
                const user = this.profileService.getCurrentUser();
                if (!user) return false;

                if (Array.isArray(profiles)) {
                    return profiles.includes(user.userTypeEnum);
                }
                return user.userTypeEnum === profiles;

            case 'canAccess':
                return this.profileService.canAccessRoute(component || '');

            case 'getProfile':
                const currentUser = this.profileService.getCurrentUser();
                return currentUser?.userTypeEnum || null;

            default:
                return false;
        }
    }
}

/**
 * ProfilePipe usage examples:
 * 
 * <!-- Check if user has permission -->
 * <div *ngIf="'reports' | profile:'hasPermission':'reports':'export'">Export button</div>
 * 
 * <!-- Check if user has specific profile -->
 * <div *ngIf="'GESTOR_ACESSEBANK' | profile:'hasProfile'">Gestor content</div>
 * <div *ngIf="['GESTOR_ACESSEBANK', 'ADMIN'] | profile:'hasProfile'">Gestor or Admin content</div>
 * 
 * <!-- Check if user can access route -->
 * <a *ngIf="'/admin' | profile:'canAccess':'/admin'" routerLink="/admin">Admin Panel</a>
 * 
 * <!-- Get current user profile -->
 * <span>Current profile: {{ null | profile:'getProfile' }}</span>
 */
