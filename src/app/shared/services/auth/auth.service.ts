import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
        roles: string[];
    };
    expiresIn: number;
}

export interface SignupRequest {
    email: string;
    password: string;
    name: string;
    confirmPassword: string;
}

export interface SignupResponse {
    message: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly API_BASE_URL = 'https://hml.acessebank.com.br/acessebankapi/api/v1';
    private readonly STORAGE_KEY = 'authToken';

    private currentUserSubject = new BehaviorSubject<any>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) {
        // Verificar se há token salvo ao inicializar
        this.loadStoredToken();
    }

    /**
     * Realiza login do usuário
     */
    login(credentials: LoginRequest): Observable<LoginResponse> {
        const headers = this.getDefaultHeaders();

        return this.http.post<LoginResponse>(`${this.API_BASE_URL}/auth/login`, credentials, { headers })
            .pipe(
                tap(response => {
                    if (response.token) {
                        this.setToken(response.token);
                        this.currentUserSubject.next(response.user);
                    }
                })
            );
    }

    /**
     * Realiza cadastro de novo usuário
     */
    signup(userData: SignupRequest): Observable<SignupResponse> {
        const headers = this.getDefaultHeaders();

        return this.http.post<SignupResponse>(`${this.API_BASE_URL}/auth/signup`, userData, { headers });
    }

    /**
     * Realiza logout do usuário
     */
    logout(): void {
        this.removeToken();
        this.currentUserSubject.next(null);
    }

    /**
     * Verifica se o usuário está autenticado
     */
    isAuthenticated(): boolean {
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token);
    }

    /**
     * Obtém o token atual
     */
    getToken(): string | null {
        return localStorage.getItem(this.STORAGE_KEY);
    }

    /**
     * Define o token no localStorage
     */
    private setToken(token: string): void {
        localStorage.setItem(this.STORAGE_KEY, token);
    }

    /**
     * Remove o token do localStorage
     */
    private removeToken(): void {
        localStorage.removeItem(this.STORAGE_KEY);
    }

    /**
     * Carrega token salvo e define usuário atual
     */
    private loadStoredToken(): void {
        const token = this.getToken();
        if (token && !this.isTokenExpired(token)) {
            // Decodificar token JWT para obter dados do usuário
            try {
                const payload = this.decodeJWT(token);
                this.currentUserSubject.next(payload);
            } catch (error) {
                console.error('Erro ao decodificar token:', error);
                this.removeToken();
            }
        }
    }

    /**
     * Verifica se o token está expirado
     */
    private isTokenExpired(token: string): boolean {
        try {
            const payload = this.decodeJWT(token);
            const currentTime = Math.floor(Date.now() / 1000);
            return payload.exp < currentTime;
        } catch (error) {
            return true;
        }
    }

    /**
     * Decodifica token JWT
     */
    private decodeJWT(token: string): any {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    }

    /**
     * Obtém headers padrão para requisições
     */
    private getDefaultHeaders(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/plain, */*',
            'sec-ch-ua-platform': '"macOS"',
            'sec-ch-ua': '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
            'sec-ch-ua-mobile': '?0',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36'
        });
    }

    /**
     * Obtém headers com autorização
     */
    getAuthHeaders(): HttpHeaders {
        const token = this.getToken();
        const headers = this.getDefaultHeaders();

        if (token) {
            return headers.set('Authorization', `Bearer ${token}`);
        }

        return headers;
    }

    /**
     * Obtém dados do usuário atual
     */
    getCurrentUser(): any {
        return this.currentUserSubject.value;
    }

    /**
     * Verifica se o usuário tem uma role específica
     */
    hasRole(role: string): boolean {
        const user = this.getCurrentUser();
        return user && user.roles && user.roles.includes(role);
    }

    /**
     * Verifica se o usuário tem alguma das roles especificadas
     */
    hasAnyRole(roles: string[]): boolean {
        const user = this.getCurrentUser();
        if (!user || !user.roles) return false;

        return roles.some(role => user.roles.includes(role));
    }
}
