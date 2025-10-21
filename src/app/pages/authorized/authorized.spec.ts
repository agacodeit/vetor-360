import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { Authorized } from './authorized';
import { AuthService } from '../../shared/services/auth/auth.service';
import { HeaderComponent } from '../../shared';

describe('Authorized', () => {
  let component: Authorized;
  let fixture: ComponentFixture<Authorized>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    // Criar mocks dos serviços
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'logout',
      'getCurrentUser',
      'getToken'
    ]);

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        Authorized,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Authorized);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;

    // Obter referências aos serviços mockados
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should be defined', () => {
      expect(component).toBeDefined();
    });

    it('should inject AuthService', () => {
      expect(authService).toBeTruthy();
    });

    it('should inject Router', () => {
      expect(router).toBeTruthy();
    });
  });

  describe('Template Rendering', () => {
    it('should render the header component', () => {
      const headerElement = compiled.querySelector('ds-header');
      expect(headerElement).toBeTruthy();
    });

    it('should render the main content container', () => {
      const mainElement = compiled.querySelector('main.authorized-content');
      expect(mainElement).toBeTruthy();
    });

    it('should have container class on main element', () => {
      const mainElement = compiled.querySelector('main');
      expect(mainElement?.classList.contains('container')).toBe(true);
    });

    it('should render router-outlet', () => {
      const routerOutlet = compiled.querySelector('router-outlet');
      expect(routerOutlet).toBeTruthy();
    });

    it('should have correct structure with header and main', () => {
      const header = compiled.querySelector('ds-header');
      const main = compiled.querySelector('main.authorized-content');

      expect(header).toBeTruthy();
      expect(main).toBeTruthy();
    });
  });

  describe('Header Component Integration', () => {
    it('should bind onProfileClick event to header', () => {
      const headerDebugElement: DebugElement = fixture.debugElement.query(By.directive(HeaderComponent));
      expect(headerDebugElement).toBeTruthy();

      const headerComponent = headerDebugElement.componentInstance;
      expect(headerComponent).toBeTruthy();
    });

    it('should call onProfileClick when header emits event', () => {
      spyOn(component, 'onProfileClick');

      const headerDebugElement: DebugElement = fixture.debugElement.query(By.directive(HeaderComponent));
      const headerComponent = headerDebugElement.componentInstance as HeaderComponent;

      // Emitir evento do header
      headerComponent.onProfileClick.emit();

      expect(component.onProfileClick).toHaveBeenCalled();
    });

    it('should handle profile click event from header', () => {
      const headerDebugElement: DebugElement = fixture.debugElement.query(By.directive(HeaderComponent));
      const headerComponent = headerDebugElement.componentInstance as HeaderComponent;

      spyOn(component, 'onProfileClick');

      headerComponent.onProfileClick.emit();

      expect(component.onProfileClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Component Methods', () => {
    describe('onProfileClick', () => {
      it('should exist', () => {
        expect(component.onProfileClick).toBeDefined();
      });

      it('should be a function', () => {
        expect(typeof component.onProfileClick).toBe('function');
      });

      it('should execute without errors', () => {
        expect(() => component.onProfileClick()).not.toThrow();
      });

      it('should be callable', () => {
        const spy = spyOn(component, 'onProfileClick');
        component.onProfileClick();
        expect(spy).toHaveBeenCalled();
      });
    });
  });

  describe('Component Lifecycle', () => {
    it('should initialize without errors', () => {
      expect(() => {
        const newFixture = TestBed.createComponent(Authorized);
        newFixture.detectChanges();
      }).not.toThrow();
    });

    it('should handle multiple change detection cycles', () => {
      expect(() => {
        fixture.detectChanges();
        fixture.detectChanges();
        fixture.detectChanges();
      }).not.toThrow();
    });
  });

  describe('Service Dependencies', () => {
    it('should have access to AuthService', () => {
      expect(component['authService']).toBeDefined();
    });

    it('should have access to Router', () => {
      expect(component['router']).toBeDefined();
    });

    it('should use injected AuthService instance', () => {
      const injectedService = component['authService'];
      expect(injectedService).toBe(authService);
    });

    it('should use injected Router instance', () => {
      const injectedRouter = component['router'];
      expect(injectedRouter).toBe(router);
    });
  });

  describe('Component Structure', () => {
    it('should have RouterOutlet imported', () => {
      const routerOutlet = fixture.debugElement.query(By.css('router-outlet'));
      expect(routerOutlet).toBeTruthy();
    });

    it('should have HeaderComponent imported', () => {
      const header = fixture.debugElement.query(By.directive(HeaderComponent));
      expect(header).toBeTruthy();
    });
  });

  describe('DOM Structure', () => {
    it('should have correct CSS classes', () => {
      const main = compiled.querySelector('main');
      expect(main?.classList.contains('authorized-content')).toBe(true);
      expect(main?.classList.contains('container')).toBe(true);
    });

    it('should maintain proper element hierarchy', () => {
      const header = compiled.querySelector('ds-header');
      const main = compiled.querySelector('main');
      const routerOutlet = compiled.querySelector('router-outlet');

      expect(header).toBeTruthy();
      expect(main).toBeTruthy();
      expect(routerOutlet).toBeTruthy();
      expect(main?.contains(routerOutlet as Node)).toBe(true);
    });
  });
});
