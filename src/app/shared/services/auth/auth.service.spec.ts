import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { take } from 'rxjs/operators';
import {
    EXPIRED_JWT_TOKEN,
    INVALID_JWT_TOKEN,
    MOCK_EXISTING_EMAIL_SIGNUP_REQUEST,
    MOCK_GESTOR_USER,
    MOCK_INVALID_LOGIN_REQUEST,
    MOCK_LOGIN_ERROR,
    MOCK_LOGIN_REQUEST_GESTOR,
    MOCK_LOGIN_RESPONSE_GESTOR,
    MOCK_SIGNUP_EMAIL_EXISTS_ERROR,
    MOCK_SIGNUP_REQUEST,
    MOCK_SIGNUP_RESPONSE,
    VALID_JWT_TOKEN
} from '../../__mocks__';
import { ProfileService } from '../profile/profile.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;
    let profileService: jasmine.SpyObj<ProfileService>;

    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();

        const profileServiceSpy = jasmine.createSpyObj('ProfileService', [
            'setCurrentUser',
            'clearCurrentUser',
            'getCurrentUser'
        ]);

        TestBed.configureTestingModule({
            providers: [
                AuthService,
                { provide: ProfileService, useValue: profileServiceSpy },
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });

        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
        profileService = TestBed.inject(ProfileService) as jasmine.SpyObj<ProfileService>;
    });

    afterEach(() => {
        httpMock.verify();
        localStorage.clear();
    });

    describe('Service Initialization', () => {
        it('should be created', () => {
            expect(service).toBeTruthy();
        });

        it('should initialize currentUser$ as observable', (done) => {
            service.currentUser$.subscribe(user => {
                expect(user).toBeDefined();
                done();
            });
        });

        it('should load stored token on initialization', () => {
            localStorage.setItem('bearerToken', VALID_JWT_TOKEN);
            profileService.getCurrentUser.and.returnValue(MOCK_GESTOR_USER);

            // Criar novo serviço para testar inicialização
            const httpClient = TestBed.inject(HttpClient);
            const newService = new AuthService(httpClient, profileService);

            expect(newService.getToken()).toBe(VALID_JWT_TOKEN);
        });

        it('should not set currentUser if token is expired on initialization', () => {
            localStorage.setItem('bearerToken', EXPIRED_JWT_TOKEN);

            const httpClient = TestBed.inject(HttpClient);
            const newService = new AuthService(httpClient, profileService);

            expect(newService.getCurrentUser()).toBeNull();
        });
    });

    describe('login Method', () => {
        it('should login successfully', async () => {
            // Start the login process
            const loginPromise = service.login(MOCK_LOGIN_REQUEST_GESTOR);

            // Mock the login request
            const loginReq = httpMock.expectOne('/api/v1/auth/login');
            expect(loginReq.request.method).toBe('POST');
            expect(loginReq.request.body).toEqual(MOCK_LOGIN_REQUEST_GESTOR);
            loginReq.flush(MOCK_LOGIN_RESPONSE_GESTOR);

            // Aguardar tick para permitir que o código assíncrono processe a resposta
            await new Promise(resolve => setTimeout(resolve, 0));

            // Mock the user data request that happens after successful login
            const userReq = httpMock.expectOne('/api/v1/secure/user');
            expect(userReq.request.method).toBe('GET');
            userReq.flush(MOCK_GESTOR_USER);

            const response = await loginPromise;

            expect(response).toBeTruthy();
            expect(response?.name).toBe(MOCK_GESTOR_USER.name);
            expect(profileService.setCurrentUser).toHaveBeenCalledWith(MOCK_GESTOR_USER);
        });

        it('should set token in localStorage on successful login', async () => {
            const loginPromise = service.login(MOCK_LOGIN_REQUEST_GESTOR);

            const loginReq = httpMock.expectOne('/api/v1/auth/login');
            loginReq.flush(MOCK_LOGIN_RESPONSE_GESTOR);

            await new Promise(resolve => setTimeout(resolve, 0));

            const userReq = httpMock.expectOne('/api/v1/secure/user');
            userReq.flush(MOCK_GESTOR_USER);

            await loginPromise;

            expect(localStorage.getItem('bearerToken')).toBe(VALID_JWT_TOKEN);
        });

        it('should update currentUser$ on successful login', async () => {
            const userPromise = new Promise((resolve) => {
                service.currentUser$.subscribe(user => {
                    if (user) {
                        expect(user.email).toBe(MOCK_GESTOR_USER.email);
                        expect(user.name).toBe(MOCK_GESTOR_USER.name);
                        resolve(user);
                    }
                });
            });

            const loginPromise = service.login(MOCK_LOGIN_REQUEST_GESTOR);

            const loginReq = httpMock.expectOne('/api/v1/auth/login');
            loginReq.flush(MOCK_LOGIN_RESPONSE_GESTOR);

            await new Promise(resolve => setTimeout(resolve, 0));

            const userReq = httpMock.expectOne('/api/v1/secure/user');
            userReq.flush(MOCK_GESTOR_USER);

            await loginPromise;
            await userPromise;
        });

        it('should send correct headers on login', async () => {
            const loginPromise = service.login(MOCK_LOGIN_REQUEST_GESTOR);

            const loginReq = httpMock.expectOne('/api/v1/auth/login');
            expect(loginReq.request.headers.get('Content-Type')).toBe('application/json');
            expect(loginReq.request.headers.get('Accept')).toBe('application/json, text/plain, */*');
            loginReq.flush(MOCK_LOGIN_RESPONSE_GESTOR);

            await new Promise(resolve => setTimeout(resolve, 0));

            const userReq = httpMock.expectOne('/api/v1/secure/user');
            userReq.flush(MOCK_GESTOR_USER);

            await loginPromise;
        });

        it('should handle login error', async () => {
            const loginPromise = service.login(MOCK_INVALID_LOGIN_REQUEST);

            const req = httpMock.expectOne('/api/v1/auth/login');
            req.flush(MOCK_LOGIN_ERROR.error, {
                status: MOCK_LOGIN_ERROR.status,
                statusText: MOCK_LOGIN_ERROR.statusText
            });

            const result = await loginPromise;

            expect(result).toBeNull();
        });

        it('should return null when login response has no token', async () => {
            const loginPromise = service.login(MOCK_LOGIN_REQUEST_GESTOR);

            const loginReq = httpMock.expectOne('/api/v1/auth/login');
            loginReq.flush({ ...MOCK_LOGIN_RESPONSE_GESTOR, token: null });

            const response = await loginPromise;

            expect(response).toBeNull();
        });

        it('should return null when user loading fails', async () => {
            const loginPromise = service.login(MOCK_LOGIN_REQUEST_GESTOR);

            const loginReq = httpMock.expectOne('/api/v1/auth/login');
            loginReq.flush(MOCK_LOGIN_RESPONSE_GESTOR);

            await new Promise(resolve => setTimeout(resolve, 0));

            const userReq = httpMock.expectOne('/api/v1/secure/user');
            userReq.flush(null);

            const response = await loginPromise;

            expect(response).toBeNull();
        });
    });

    describe('signup Method', () => {
        it('should signup successfully', () => {
            service.signup(MOCK_SIGNUP_REQUEST).subscribe(response => {
                expect(response).toEqual(MOCK_SIGNUP_RESPONSE);
            });

            const req = httpMock.expectOne('/api/v1/user/create');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(MOCK_SIGNUP_REQUEST);
            req.flush(MOCK_SIGNUP_RESPONSE);
        });

        it('should send correct headers on signup', () => {
            service.signup(MOCK_SIGNUP_REQUEST).subscribe();

            const req = httpMock.expectOne('/api/v1/user/create');
            expect(req.request.headers.get('Content-Type')).toBe('application/json');
            expect(req.request.headers.get('Accept')).toBe('application/json, text/plain, */*');
            req.flush(MOCK_SIGNUP_RESPONSE);
        });

        it('should handle signup error for existing email', (done) => {
            service.signup(MOCK_EXISTING_EMAIL_SIGNUP_REQUEST).subscribe(
                () => fail('should have failed'),
                error => {
                    expect(error.status).toBe(MOCK_SIGNUP_EMAIL_EXISTS_ERROR.status);
                    expect(error.error.message).toBe(MOCK_SIGNUP_EMAIL_EXISTS_ERROR.error.message);
                    done();
                }
            );

            const req = httpMock.expectOne('/api/v1/user/create');
            req.flush(MOCK_SIGNUP_EMAIL_EXISTS_ERROR.error, {
                status: MOCK_SIGNUP_EMAIL_EXISTS_ERROR.status,
                statusText: MOCK_SIGNUP_EMAIL_EXISTS_ERROR.statusText
            });
        });
    });

    describe('logout Method', () => {
        it('should logout and clear token', () => {
            localStorage.setItem('bearerToken', VALID_JWT_TOKEN);
            service.logout();

            expect(service.getToken()).toBeNull();
            expect(service.isAuthenticated()).toBeFalsy();
            expect(profileService.clearCurrentUser).toHaveBeenCalled();
        });

        it('should clear currentUser on logout', (done) => {
            localStorage.setItem('bearerToken', VALID_JWT_TOKEN);

            // Mock o getCurrentUser para evitar chamada à API
            profileService.getCurrentUser.and.returnValue(MOCK_GESTOR_USER);

            service['loadStoredToken']();

            service.logout();

            service.currentUser$.pipe(take(1)).subscribe(user => {
                expect(user).toBeNull();
                done();
            });
        });

        it('should remove token from localStorage', () => {
            localStorage.setItem('bearerToken', VALID_JWT_TOKEN);

            service.logout();

            expect(localStorage.getItem('bearerToken')).toBeNull();
        });

        it('should remove last sync time from localStorage', () => {
            localStorage.setItem('lastUserSync', '123456789');

            service.logout();

            expect(localStorage.getItem('lastUserSync')).toBeNull();
        });
    });

    describe('isAuthenticated Method', () => {
        it('should return true when token is valid', () => {
            localStorage.setItem('bearerToken', VALID_JWT_TOKEN);

            expect(service.isAuthenticated()).toBeTruthy();
        });

        it('should return false when token is expired', () => {
            localStorage.setItem('bearerToken', EXPIRED_JWT_TOKEN);

            expect(service.isAuthenticated()).toBeFalsy();
        });

        it('should return false when no token exists', () => {
            expect(service.isAuthenticated()).toBeFalsy();
        });

        it('should return false for malformed token', () => {
            localStorage.setItem('bearerToken', INVALID_JWT_TOKEN);

            expect(service.isAuthenticated()).toBeFalsy();
        });
    });

    describe('getToken Method', () => {
        it('should return stored token', () => {
            localStorage.setItem('bearerToken', VALID_JWT_TOKEN);

            expect(service.getToken()).toBe(VALID_JWT_TOKEN);
        });

        it('should return null when no token exists', () => {
            expect(service.getToken()).toBeNull();
        });
    });

    describe('getAuthHeaders Method', () => {
        it('should return headers with Authorization when token exists', () => {
            localStorage.setItem('bearerToken', VALID_JWT_TOKEN);

            const headers = service.getAuthHeaders();

            expect(headers.get('Authorization')).toBe(`Bearer ${VALID_JWT_TOKEN}`);
            expect(headers.get('Content-Type')).toBe('application/json');
        });

        it('should return headers without Authorization when no token', () => {
            const headers = service.getAuthHeaders();

            expect(headers.get('Authorization')).toBeNull();
            expect(headers.get('Content-Type')).toBe('application/json');
        });
    });

    describe('getCurrentUser Method', () => {
        it('should return current user data', () => {
            service['currentUserSubject'].next(MOCK_GESTOR_USER);

            expect(service.getCurrentUser()).toEqual(MOCK_GESTOR_USER);
        });

        it('should return null when no user is logged in', () => {
            expect(service.getCurrentUser()).toBeNull();
        });
    });

    describe('hasRole Method', () => {
        it('should return true when user has the specified role', () => {
            // Simular usuário com roles para compatibilidade com testes antigos
            const mockUser = { ...MOCK_GESTOR_USER, roles: ['USER', 'ADMIN'] };
            service['currentUserSubject'].next(mockUser);

            expect(service.hasRole('USER')).toBeTruthy();
        });

        it('should return false when user does not have the role', () => {
            const mockUser = { ...MOCK_GESTOR_USER, roles: ['USER'] };
            service['currentUserSubject'].next(mockUser);

            expect(service.hasRole('ADMIN')).toBeFalsy();
        });

        it('should return false when user is not logged in', () => {
            expect(service.hasRole('USER')).toBeFalsy();
        });

        it('should return false when user has no roles', () => {
            service['currentUserSubject'].next(MOCK_GESTOR_USER);

            expect(service.hasRole('USER')).toBeFalsy();
        });
    });

    describe('hasAnyRole Method', () => {
        it('should return true when user has any of the specified roles', () => {
            const mockUser = { ...MOCK_GESTOR_USER, roles: ['USER', 'ADMIN', 'EDITOR'] };
            service['currentUserSubject'].next(mockUser);

            expect(service.hasAnyRole(['ADMIN', 'EDITOR'])).toBeTruthy();
        });

        it('should return false when user has none of the specified roles', () => {
            const mockUser = { ...MOCK_GESTOR_USER, roles: ['USER'] };
            service['currentUserSubject'].next(mockUser);

            expect(service.hasAnyRole(['ADMIN', 'SUPER_USER'])).toBeFalsy();
        });

        it('should return false when user is not logged in', () => {
            expect(service.hasAnyRole(['USER', 'ADMIN'])).toBeFalsy();
        });

        it('should return false when user has no roles', () => {
            const mockUser = { ...MOCK_GESTOR_USER, roles: [] };
            service['currentUserSubject'].next(mockUser);

            expect(service.hasAnyRole(['USER', 'ADMIN'])).toBeFalsy();
        });

        it('should return true when user has all specified roles', () => {
            const mockUser = { ...MOCK_GESTOR_USER, roles: ['USER', 'ADMIN', 'EDITOR'] };
            service['currentUserSubject'].next(mockUser);

            expect(service.hasAnyRole(['USER', 'ADMIN'])).toBeTruthy();
        });
    });

    describe('loadUserFromAPI Method', () => {
        it('should load user from API successfully', async () => {
            localStorage.setItem('bearerToken', VALID_JWT_TOKEN);

            const loadPromise = service['loadUserFromAPI']();

            await new Promise(resolve => setTimeout(resolve, 0));

            const userReq = httpMock.expectOne('/api/v1/secure/user');
            expect(userReq.request.method).toBe('GET');
            expect(userReq.request.headers.get('Authorization')).toBe(`Bearer ${VALID_JWT_TOKEN}`);
            userReq.flush(MOCK_GESTOR_USER);

            const user = await loadPromise;

            expect(user).toEqual(MOCK_GESTOR_USER);
            expect(profileService.setCurrentUser).toHaveBeenCalledWith(MOCK_GESTOR_USER);
        });

        it('should return null when no token exists', async () => {
            const user = await service['loadUserFromAPI']();

            expect(user).toBeNull();
        });

        it('should handle API error and return cached user', async () => {
            localStorage.setItem('bearerToken', VALID_JWT_TOKEN);
            profileService.getCurrentUser.and.returnValue(MOCK_GESTOR_USER);

            const loadPromise = service['loadUserFromAPI']();

            await new Promise(resolve => setTimeout(resolve, 0));

            const userReq = httpMock.expectOne('/api/v1/secure/user');
            userReq.flush(null, { status: 500, statusText: 'Internal Server Error' });

            const user = await loadPromise;

            expect(user).toEqual(MOCK_GESTOR_USER);
        });

        it('should return null when API error and no cached user', async () => {
            localStorage.setItem('bearerToken', VALID_JWT_TOKEN);
            profileService.getCurrentUser.and.returnValue(null);

            const loadPromise = service['loadUserFromAPI']();

            await new Promise(resolve => setTimeout(resolve, 0));

            const userReq = httpMock.expectOne('/api/v1/secure/user');
            userReq.flush(null, { status: 500, statusText: 'Internal Server Error' });

            const user = await loadPromise;

            expect(user).toBeNull();
        });
    });

    describe('Token Expiration and Decoding', () => {
        it('should correctly decode valid JWT token', () => {
            localStorage.setItem('bearerToken', VALID_JWT_TOKEN);
            profileService.getCurrentUser.and.returnValue(MOCK_GESTOR_USER);

            service['loadStoredToken']();

            // Verificar se o token foi carregado corretamente
            expect(service.getToken()).toBe(VALID_JWT_TOKEN);
            expect(service.isAuthenticated()).toBeTruthy();
        });

        it('should handle malformed token gracefully', () => {
            localStorage.setItem('bearerToken', INVALID_JWT_TOKEN);

            expect(() => service['loadStoredToken']()).not.toThrow();
            // Token malformado causa erro no decode, resultando na remoção do token
            expect(service.getCurrentUser()).toBeNull();
        });

        it('should remove expired token on load', () => {
            localStorage.setItem('bearerToken', EXPIRED_JWT_TOKEN);
            service['loadStoredToken']();

            expect(service.getCurrentUser()).toBeNull();
        });
    });

    describe('Integration Tests', () => {
        it('should complete full authentication flow', async () => {
            // Login
            const loginPromise = service.login(MOCK_LOGIN_REQUEST_GESTOR);

            const loginReq = httpMock.expectOne('/api/v1/auth/login');
            loginReq.flush(MOCK_LOGIN_RESPONSE_GESTOR);

            await new Promise(resolve => setTimeout(resolve, 0));

            const userReq = httpMock.expectOne('/api/v1/secure/user');
            userReq.flush(MOCK_GESTOR_USER);

            await loginPromise;

            expect(service.isAuthenticated()).toBeTruthy();

            // Adicionar roles para teste
            const mockUser = { ...MOCK_GESTOR_USER, roles: ['USER'] };
            service['currentUserSubject'].next(mockUser);

            expect(service.hasRole('USER')).toBeTruthy();
            expect(service.hasRole('ADMIN')).toBeFalsy();

            // Logout
            service.logout();
            expect(service.isAuthenticated()).toBeFalsy();
            expect(service.getCurrentUser()).toBeNull();
        });

        it('should persist authentication across service instances', async () => {
            const loginPromise = service.login(MOCK_LOGIN_REQUEST_GESTOR);

            const loginReq = httpMock.expectOne('/api/v1/auth/login');
            loginReq.flush(MOCK_LOGIN_RESPONSE_GESTOR);

            await new Promise(resolve => setTimeout(resolve, 0));

            const userReq = httpMock.expectOne('/api/v1/secure/user');
            userReq.flush(MOCK_GESTOR_USER);

            await loginPromise;

            // Criar nova instância do serviço
            const httpClient = TestBed.inject(HttpClient);
            profileService.getCurrentUser.and.returnValue(MOCK_GESTOR_USER);
            const newService = new AuthService(httpClient, profileService);

            expect(newService.getToken()).toBe(VALID_JWT_TOKEN);
        });

        it('should handle multiple role checks efficiently', () => {
            const mockUser = { ...MOCK_GESTOR_USER, roles: ['USER', 'ADMIN', 'EDITOR', 'MODERATOR'] };
            service['currentUserSubject'].next(mockUser);

            expect(service.hasRole('USER')).toBeTruthy();
            expect(service.hasRole('ADMIN')).toBeTruthy();
            expect(service.hasRole('EDITOR')).toBeTruthy();
            expect(service.hasRole('MODERATOR')).toBeTruthy();
            expect(service.hasRole('SUPER_ADMIN')).toBeFalsy();

            expect(service.hasAnyRole(['SUPER_ADMIN', 'USER'])).toBeTruthy();
            expect(service.hasAnyRole(['SUPER_ADMIN', 'OWNER'])).toBeFalsy();
        });
    });

    describe('User Synchronization', () => {
        it('should save last sync time on successful login', async () => {
            const loginPromise = service.login(MOCK_LOGIN_REQUEST_GESTOR);

            const loginReq = httpMock.expectOne('/api/v1/auth/login');
            loginReq.flush(MOCK_LOGIN_RESPONSE_GESTOR);

            await new Promise(resolve => setTimeout(resolve, 0));

            const userReq = httpMock.expectOne('/api/v1/secure/user');
            userReq.flush(MOCK_GESTOR_USER);

            await loginPromise;

            expect(localStorage.getItem('lastUserSync')).toBeTruthy();
        });

        it('should check and sync user when needed', async () => {
            const now = Date.now();
            localStorage.setItem('lastUserSync', (now - 6 * 60 * 1000).toString()); // 6 minutes ago
            localStorage.setItem('bearerToken', VALID_JWT_TOKEN);

            service['checkAndSyncUser']();

            await new Promise(resolve => setTimeout(resolve, 0));

            // Should trigger sync since it's been more than 5 minutes
            const userReq = httpMock.expectOne('/api/v1/secure/user');
            userReq.flush(MOCK_GESTOR_USER);
        });

        it('should not sync when recent sync exists', () => {
            const now = Date.now();
            localStorage.setItem('lastUserSync', (now - 2 * 60 * 1000).toString()); // 2 minutes ago
            localStorage.setItem('bearerToken', VALID_JWT_TOKEN);

            service['checkAndSyncUser']();

            // Should not trigger sync since it's been less than 5 minutes
            httpMock.expectNone('/api/v1/secure/user');
        });

        it('should get user with sync', async () => {
            profileService.getCurrentUser.and.returnValue(MOCK_GESTOR_USER);

            const user = await service.getUserWithSync();

            expect(user).toEqual(MOCK_GESTOR_USER);
        });

        it('should load from API when no cached user', async () => {
            profileService.getCurrentUser.and.returnValue(null);
            localStorage.setItem('bearerToken', VALID_JWT_TOKEN);

            const userPromise = service.getUserWithSync();

            await new Promise(resolve => setTimeout(resolve, 0));

            const userReq = httpMock.expectOne('/api/v1/secure/user');
            userReq.flush(MOCK_GESTOR_USER);

            const user = await userPromise;

            expect(user).toEqual(MOCK_GESTOR_USER);
        });

        it('should force sync with API', async () => {
            localStorage.setItem('bearerToken', VALID_JWT_TOKEN);

            const syncPromise = service.forceSyncWithAPI();

            await new Promise(resolve => setTimeout(resolve, 0));

            const userReq = httpMock.expectOne('/api/v1/secure/user');
            userReq.flush(MOCK_GESTOR_USER);

            const user = await syncPromise;

            expect(user).toEqual(MOCK_GESTOR_USER);
        });
    });
});