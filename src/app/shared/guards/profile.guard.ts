import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ProfileService } from '../services/profile/profile.service';
import { UserProfile } from '../types/profile.types';

export interface ProfileGuardData {
    requiredProfiles?: UserProfile[];
    requiredPermissions?: Array<{ component: string, action?: string }>;
    redirectTo?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ProfileGuard implements CanActivate, CanActivateChild {

    constructor(
        private profileService: ProfileService,
        private router: Router
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        return this.checkProfileAccess(route, state);
    }

    canActivateChild(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        return this.checkProfileAccess(route, state);
    }

    private checkProfileAccess(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        const guardData = route.data as ProfileGuardData;

        // If no guard data is provided, allow access
        if (!guardData) {
            return of(true);
        }

        // Check if user is authenticated
        if (!this.profileService.isAuthenticated()) {
            this.redirectToLogin();
            return of(false);
        }

        const user = this.profileService.getCurrentUser();
        if (!user) {
            this.redirectToLogin();
            return of(false);
        }

        // Check required profiles
        if (guardData.requiredProfiles && guardData.requiredProfiles.length > 0) {
            if (!guardData.requiredProfiles.includes(user.userTypeEnum)) {
                this.handleAccessDenied(guardData.redirectTo);
                return of(false);
            }
        }

        // Check required permissions
        if (guardData.requiredPermissions && guardData.requiredPermissions.length > 0) {
            const hasAllPermissions = guardData.requiredPermissions.every(permission =>
                this.profileService.hasPermission(permission.component, permission.action)
            );

            if (!hasAllPermissions) {
                this.handleAccessDenied(guardData.redirectTo);
                return of(false);
            }
        }

        return of(true);
    }

    private redirectToLogin(): void {
        this.router.navigate(['/unauthorized/login']);
    }

    private handleAccessDenied(redirectTo?: string): void {
        if (redirectTo) {
            this.router.navigate([redirectTo]);
        } else {
            // Default redirect to dashboard or home
            this.router.navigate(['/authorized/dashboard']);
        }
    }
}

/**
 * Decorator function to easily add profile requirements to routes
 */
export function requireProfile(profiles: UserProfile[], redirectTo?: string) {
    return {
        canActivate: [ProfileGuard],
        data: {
            requiredProfiles: profiles,
            redirectTo
        } as ProfileGuardData
    };
}

/**
 * Decorator function to easily add permission requirements to routes
 */
export function requirePermissions(permissions: Array<{ component: string, action?: string }>, redirectTo?: string) {
    return {
        canActivate: [ProfileGuard],
        data: {
            requiredPermissions: permissions,
            redirectTo
        } as ProfileGuardData
    };
}
