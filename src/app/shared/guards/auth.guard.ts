import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);


    const token = localStorage.getItem('authToken');
    if (state.url === '/' && token) {

        router.navigate(['/authorized/dashboard']);
        return false; // Impede a navegação para a rota atual
    } else if (!token) {

        router.navigate(['/unauthorized/login']);
        return false; // Impede a navegação para a rota atual
    } else return true;
};
