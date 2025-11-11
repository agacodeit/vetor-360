import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor } from './shared/interceptors';
import { OperationRegistryService } from './shared';

function preloadOperationTypes(operationRegistry: OperationRegistryService) {
  return () => operationRegistry.loadOperationTypes();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync('animations'),
    {
      provide: APP_INITIALIZER,
      useFactory: preloadOperationTypes,
      deps: [OperationRegistryService],
      multi: true
    }
  ]
};
