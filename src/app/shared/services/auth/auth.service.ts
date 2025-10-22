import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, lastValueFrom } from 'rxjs';
import { ProfileService } from '../profile/profile.service';
import { User } from '../../types/profile.types';
import { environment } from '../../../../environments/environment';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: User;
    expiresIn: number;
}

export interface SignupRequest {
    email: string;
    password: string;
    name: string;
    cellphone: string;
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
    private readonly API_BASE_URL = '/api/v1';
    private readonly STORAGE_KEY = 'bearerToken';
    private readonly LAST_SYNC_KEY = 'lastUserSync';
    private readonly SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutos

    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(
        private http: HttpClient,
        private profileService: ProfileService
    ) {
        this.loadStoredToken();
    }

    /**
     * Realiza login do usuário
     */
    async login(credentials: LoginRequest) {
        try {
            // 1. Fazer login na API do AcesseBank
            const loginResponse = await lastValueFrom(this.http.post<LoginResponse>(`${this.API_BASE_URL}/auth/login`, credentials, {
                headers: this.getDefaultHeaders()
            }));

            if (loginResponse?.token) {
                // 2. Salvar token
                this.setToken(loginResponse.token);

                // 3. Carregar dados do usuário da API
                const user = await this.loadUserFromAPI();

                if (user) {
                    // 4. Definir usuário no ProfileService
                    this.profileService.setCurrentUser(user);
                    this.currentUserSubject.next(user);
                    this.saveLastSyncTime();

                    console.log('Login realizado com sucesso:', user.name);
                    return user;
                }
            }

            return null;
        } catch (error) {
            console.error('Erro no login:', error);
            return null;
        }
    }

    /**
     * Realiza cadastro de novo usuário
     */
    signup(userData: SignupRequest): Observable<SignupResponse> {
        const headers = this.getDefaultHeaders();

        return this.http.post<SignupResponse>(`${this.API_BASE_URL}/user/create`, userData, { headers });
    }

    /**
     * Realiza logout do usuário
     */
    logout(): void {
        this.removeToken();
        this.currentUserSubject.next(null);
        this.profileService.clearCurrentUser();
        localStorage.removeItem(this.LAST_SYNC_KEY);
        console.log('Logout realizado');
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
            // Carregar usuário do ProfileService (que já tem dados do localStorage)
            const user = this.profileService.getCurrentUser();
            if (user) {
                this.currentUserSubject.next(user);
            } else {
                // Se não há dados locais, tentar carregar da API
                this.loadUserFromAPI();
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
            'Accept': 'application/json, text/plain, */*'
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
     * Verifica se o usuário tem uma role específica (deprecated - use ProfileService)
     */
    hasRole(role: string): boolean {
        const user = this.getCurrentUser();
        // Para compatibilidade com testes antigos
        return user && (user as any).roles && (user as any).roles.includes(role);
    }

    /**
     * Verifica se o usuário tem alguma das roles especificadas (deprecated - use ProfileService)
     */
    hasAnyRole(roles: string[]): boolean {
        const user = this.getCurrentUser();
        if (!user || !(user as any).roles) return false;

        return roles.some(role => (user as any).roles.includes(role));
    }

    /**
     * Carrega dados do usuário da API
     */
    async loadUserFromAPI(): Promise<User | null> {
        try {
            const token = this.getToken();
            if (!token) {
                return null;
            }

            const response = await lastValueFrom(this.http.get<User>(`${this.API_BASE_URL}/secure/user`, {
                headers: this.getAuthHeaders()
            }));

            if (response) {
                this.profileService.setCurrentUser(response);
                this.currentUserSubject.next(response);
                this.saveLastSyncTime();
                return response;
            }

            return null;
        } catch (error) {
            console.error('Erro ao carregar usuário da API:', error);
            // Se a API falhar, manter dados do localStorage se existirem
            return this.profileService.getCurrentUser();
        }
    }

    /**
     * Força sincronização com a API
     */
    async forceSyncWithAPI(): Promise<User | null> {
        return await this.loadUserFromAPI();
    }

    /**
     * Verifica se precisa sincronizar com a API
     */
    private checkAndSyncUser(): void {
        const lastSync = localStorage.getItem(this.LAST_SYNC_KEY);
        const now = Date.now();

        if (!lastSync || (now - parseInt(lastSync)) > this.SYNC_INTERVAL) {
            // Sync com API em background
            this.loadUserFromAPI();
        }
    }

    /**
     * Salva tempo da última sincronização
     */
    private saveLastSyncTime(): void {
        localStorage.setItem(this.LAST_SYNC_KEY, Date.now().toString());
    }

    /**
     * Obtém usuário com sincronização automática
     */
    async getUserWithSync(): Promise<User | null> {
        const user = this.profileService.getCurrentUser();

        if (!user) {
            // Sem dados de usuário, tentar carregar da API
            return await this.loadUserFromAPI();
        }

        // Verificar se sync é necessário
        this.checkAndSyncUser();

        return user;
    }
}
