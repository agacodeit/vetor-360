import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProfileService } from '../services/profile/profile.service';
import { UserProfile } from '../types/profile.types';

@Directive({
    selector: '[profileIf], [profileIfComponent]',
    standalone: true
})
export class ProfileIfDirective implements OnInit, OnDestroy {
    private subscription: Subscription = new Subscription();
    private hasView = false;

    @Input() profileIf: UserProfile | UserProfile[] | string | string[] = '';
    @Input() profileIfAction: string = '';
    @Input() profileIfComponent: string = '';
    @Input() profileIfNot: boolean = false;

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private profileService: ProfileService
    ) { }

    ngOnInit(): void {
        this.subscription.add(
            this.profileService.currentUser$.subscribe(user => {
                this.updateView();
            })
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private updateView(): void {
        const shouldShow = this.shouldShowElement();

        if (shouldShow && !this.hasView) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.hasView = true;
        } else if (!shouldShow && this.hasView) {
            this.viewContainer.clear();
            this.hasView = false;
        }
    }

    private shouldShowElement(): boolean {
        const user = this.profileService.getCurrentUser();

        if (!user) {
            return false;
        }

        let hasAccess = false;

        // Check profile-based access
        if (this.profileIf) {
            if (Array.isArray(this.profileIf)) {
                hasAccess = this.profileIf.includes(user.userTypeEnum);
            } else {
                hasAccess = user.userTypeEnum === this.profileIf;
            }
        }

        // Check permission-based access
        if (this.profileIfComponent) {
            hasAccess = this.profileService.hasPermission(
                this.profileIfComponent,
                this.profileIfAction
            );
        }

        // Apply negation if specified
        if (this.profileIfNot) {
            hasAccess = !hasAccess;
        }

        return hasAccess;
    }
}

/**
 * Directive for showing elements based on profile permissions
 * Usage examples:
 * 
 * <!-- Show only for specific profiles -->
 * <div *profileIf="'GESTOR_ACESSEBANK'">Content for Gestor</div>
 * <div *profileIf="['GESTOR_ACESSEBANK', 'ADMIN']">Content for Gestor or Admin</div>
 * 
 * <!-- Show based on permissions -->
 * <div *profileIfComponent="'reports'" *profileIfAction="'export'">Export button</div>
 * <div *profileIfComponent="'users'" *profileIfAction="'manage'">User management</div>
 * 
 * <!-- Show for everyone except specific profile -->
 * <div *profileIf="'PARCEIRO_ACESSEBANK'" *profileIfNot="true">Content not for Parceiro</div>
 */
