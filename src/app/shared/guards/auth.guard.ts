import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);

    // Verificar se existe token no localStorage
    const token = localStorage.getItem('authToken');

    if (token) {
        // Se tem token, redirecionar para dashboard
        router.navigate(['/authorized/dashboard']);
        return false; // Impede a navegação para a rota atual
    } else {
        // Se não tem token, redirecionar para login
        router.navigate(['/unauthorized/login']);
        return false; // Impede a navegação para a rota atual
    }
};
