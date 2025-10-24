import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);

    const token = localStorage.getItem('bearerToken'); // Corrigido para usar a chave correta
    const isUnauthorizedRoute = state.url.startsWith('/unauthorized');

    // Se está tentando acessar rota não autorizada, permitir
    if (isUnauthorizedRoute) {
        return true;
    }

    // Se não tem token e está tentando acessar rota autorizada, redirecionar para login
    if (!token) {
        router.navigate(['/unauthorized/login']);
        return false;
    }

    // Se tem token, permitir acesso
    return true;
};
