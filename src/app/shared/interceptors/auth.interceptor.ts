import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const router = inject(Router);

    // Obter o token do localStorage
    const token = localStorage.getItem('authToken');

    // Se o token existir, adicionar ao header Authorization
    if (token) {
        const authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

        return next(authReq).pipe(
            catchError((error: HttpErrorResponse) => {
                // Se receber 401 (Unauthorized), redirecionar para login
                if (error.status === 401) {
                    localStorage.removeItem('authToken');
                    router.navigate(['/unauthorized/login']);
                }

                return throwError(() => error);
            })
        );
    }

    // Se não houver token, continuar com a requisição original
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            // Se receber 401 (Unauthorized), redirecionar para login
            if (error.status === 401) {
                router.navigate(['/unauthorized/login']);
            }

            return throwError(() => error);
        })
    );
};
