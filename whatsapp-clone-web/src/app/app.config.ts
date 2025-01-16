import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideZoneChangeDetection
}
  from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {KeycloakService} from "./utils/keycloak/keycloak.service";
import {keycloakHttpInterceptor} from "./utils/http/keycloak-http.interceptor";

export function kcFactory(kcService: KeycloakService) {
  return () => kcService.init();
}
export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([keycloakHttpInterceptor])
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: kcFactory,
      deps: [KeycloakService],
      multi: true
    }
  ]
};
