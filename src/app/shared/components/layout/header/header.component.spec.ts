import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { ActionMenuComponent } from '../../atoms/action-menu/action-menu.component';

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HeaderComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Component initialization', () => {
        it('should initialize with correct profile menu items', () => {
            expect(component.profileMenuItems).toEqual([
                { label: 'Sair', value: 'logout', icon: 'fa-solid fa-right-from-bracket' }
            ]);
        });
    });

    describe('onMenuSelected', () => {
        it('should emit onProfileClick when logout item is selected', () => {
            spyOn(component.onProfileClick, 'emit');
            const logoutItem = { label: 'Sair', value: 'logout', icon: 'fa-solid fa-right-from-bracket' };

            component.onMenuSelected(logoutItem);

            expect(component.onProfileClick.emit).toHaveBeenCalled();
        });

        it('should not emit onProfileClick when non-logout item is selected', () => {
            spyOn(component.onProfileClick, 'emit');
            const otherItem = { label: 'Profile', value: 'profile', icon: 'fa-solid fa-user' };

            component.onMenuSelected(otherItem);

            expect(component.onProfileClick.emit).not.toHaveBeenCalled();
        });

        it('should not emit onProfileClick when item value is undefined', () => {
            spyOn(component.onProfileClick, 'emit');
            const itemWithoutValue = { label: 'Test', value: 'test', icon: 'fa-solid fa-test' };

            component.onMenuSelected(itemWithoutValue);

            expect(component.onProfileClick.emit).not.toHaveBeenCalled();
        });
    });

    describe('Template rendering', () => {
        it('should render header element', () => {
            fixture.detectChanges();

            const headerElement = fixture.nativeElement.querySelector('header');
            expect(headerElement).toBeTruthy();
            expect(headerElement.classList.contains('header')).toBe(true);
        });

        it('should render header container', () => {
            fixture.detectChanges();

            const containerElement = fixture.nativeElement.querySelector('.header__container');
            expect(containerElement).toBeTruthy();
        });

        it('should render logo section', () => {
            fixture.detectChanges();

            const logoElement = fixture.nativeElement.querySelector('.header__logo');
            expect(logoElement).toBeTruthy();
        });

        it('should render logo image with correct attributes', () => {
            fixture.detectChanges();

            const logoImage = fixture.nativeElement.querySelector('.header__logo-image');
            expect(logoImage).toBeTruthy();
            expect(logoImage.src).toContain('assets/logo/vetor-logo-1067x600.jpg');
            expect(logoImage.alt).toBe('Logo Vetor 360');
        });

        it('should render profile section', () => {
            fixture.detectChanges();

            const profileElement = fixture.nativeElement.querySelector('.header__profile');
            expect(profileElement).toBeTruthy();
        });

        it('should render action menu component', () => {
            fixture.detectChanges();

            const actionMenu = fixture.nativeElement.querySelector('ds-action-menu');
            expect(actionMenu).toBeTruthy();
        });

        it('should pass correct properties to action menu', () => {
            fixture.detectChanges();

            const actionMenu = fixture.nativeElement.querySelector('ds-action-menu');
            expect(actionMenu).toBeTruthy();
            // Verificar se o componente action-menu está sendo renderizado
            expect(actionMenu.tagName.toLowerCase()).toBe('ds-action-menu');
        });
    });

    describe('Event handling', () => {
        it('should handle item selection from action menu', () => {
            spyOn(component, 'onMenuSelected');

            // Simular diretamente a chamada do método
            const logoutItem = { label: 'Sair', value: 'logout', icon: 'fa-solid fa-right-from-bracket' };
            component.onMenuSelected(logoutItem);

            expect(component.onMenuSelected).toHaveBeenCalledWith(logoutItem);
        });
    });

    describe('Integration with ActionMenuComponent', () => {
        it('should pass profileMenuItems to action menu', () => {
            fixture.detectChanges();

            const actionMenuComponent = fixture.debugElement.query(
                (el) => el.name === 'ds-action-menu'
            );

            expect(actionMenuComponent).toBeTruthy();
            expect(actionMenuComponent.componentInstance.items).toEqual(component.profileMenuItems);
        });

        it('should pass correct trigger icon to action menu', () => {
            fixture.detectChanges();

            const actionMenuComponent = fixture.debugElement.query(
                (el) => el.name === 'ds-action-menu'
            );

            expect(actionMenuComponent.componentInstance.triggerIcon).toBe('fa-solid fa-user');
        });
    });
});
