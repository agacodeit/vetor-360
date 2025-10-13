import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const router = inject(Router);


    const token = localStorage.getItem('authToken');


    if (token) {
        const authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

        return next(authReq).pipe(
            catchError((error: HttpErrorResponse) => {

                if (error.status === 401) {
                    localStorage.removeItem('authToken');
                    router.navigate(['/unauthorized/login']);
                }

                return throwError(() => error);
            })
        );
    }


    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {

            if (error.status === 401) {
                router.navigate(['/unauthorized/login']);
            }

            return throwError(() => error);
        })
    );
};
