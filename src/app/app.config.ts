import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection, provideAppInitializer, inject } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor } from './shared/interceptors';
import { OperationRegistryService, AuthService } from './shared';

function preloadOperationTypes() {
  const operationRegistry = inject(OperationRegistryService);
  return operationRegistry.loadOperationTypes();
}

function initializeUser() {
  const authService = inject(AuthService);
  return authService.initializeUser();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync('animations'),
    provideAppInitializer(preloadOperationTypes),
    provideAppInitializer(initializeUser),
    provideRouter(routes),
  ]
};
