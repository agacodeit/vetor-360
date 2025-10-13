import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
    EXPIRED_JWT_TOKEN,
    INVALID_JWT_TOKEN,
    MOCK_EDITOR_USER,
    MOCK_EXISTING_EMAIL_SIGNUP_REQUEST,
    MOCK_INVALID_LOGIN_REQUEST,
    MOCK_LOGIN_ERROR,
    MOCK_LOGIN_REQUEST,
    MOCK_LOGIN_RESPONSE,
    MOCK_MULTI_ROLE_USER,
    MOCK_SIGNUP_EMAIL_EXISTS_ERROR,
    MOCK_SIGNUP_REQUEST,
    MOCK_SIGNUP_RESPONSE,
    MOCK_USER,
    MOCK_USER_NO_ROLES,
    PARCEIRO_JWT_TOKEN,
    VALID_JWT_TOKEN
} from '../../__mocks__';
import { AuthService } from './auth.service';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthService,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });
        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
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
            localStorage.setItem('authToken', VALID_JWT_TOKEN);

            // Criar novo serviço para testar inicialização
            const httpClient = TestBed.inject(HttpClient);
            const newService = new AuthService(httpClient);

            expect(newService.getToken()).toBe(VALID_JWT_TOKEN);
        });

        it('should not set currentUser if token is expired on initialization', () => {
            localStorage.setItem('authToken', EXPIRED_JWT_TOKEN);

            const httpClient = TestBed.inject(HttpClient);
            const newService = new AuthService(httpClient);

            expect(newService.getCurrentUser()).toBeNull();
        });
    });

    describe('login Method', () => {
        it('should login successfully', (done) => {
            service.login(MOCK_LOGIN_REQUEST).subscribe(response => {
                expect(response).toEqual(MOCK_LOGIN_RESPONSE);
                expect(service.getToken()).toBe(VALID_JWT_TOKEN);
                expect(service.getToken()).toBeTruthy();
                done();
            });

            const req = httpMock.expectOne('/api/v1/auth/login');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(MOCK_LOGIN_REQUEST);
            req.flush(MOCK_LOGIN_RESPONSE);
        });

        it('should set token in localStorage on successful login', (done) => {
            service.login(MOCK_LOGIN_REQUEST).subscribe(() => {
                expect(localStorage.getItem('authToken')).toBe(VALID_JWT_TOKEN);
                done();
            });

            const req = httpMock.expectOne('/api/v1/auth/login');
            req.flush(MOCK_LOGIN_RESPONSE);
        });

        it('should update currentUser$ on successful login', (done) => {
            service.currentUser$.subscribe(user => {
                if (user) {
                    expect(user.email).toBe('test@example.com');
                    expect(user.name).toBe('Test User');
                    done();
                }
            });

            service.login(MOCK_LOGIN_REQUEST).subscribe();

            const req = httpMock.expectOne('/api/v1/auth/login');
            req.flush(MOCK_LOGIN_RESPONSE);
        });

        it('should send correct headers on login', () => {
            service.login(MOCK_LOGIN_REQUEST).subscribe();

            const req = httpMock.expectOne('/api/v1/auth/login');
            expect(req.request.headers.get('Content-Type')).toBe('application/json');
            expect(req.request.headers.get('Accept')).toBe('application/json, text/plain, */*');
            req.flush(MOCK_LOGIN_RESPONSE);
        });

        it('should handle login error', (done) => {
            service.login(MOCK_INVALID_LOGIN_REQUEST).subscribe(
                () => fail('should have failed'),
                error => {
                    expect(error.status).toBe(MOCK_LOGIN_ERROR.status);
                    expect(error.error.message).toBe(MOCK_LOGIN_ERROR.error.message);
                    done();
                }
            );

            const req = httpMock.expectOne('/api/v1/auth/login');
            req.flush(MOCK_LOGIN_ERROR.error, {
                status: MOCK_LOGIN_ERROR.status,
                statusText: MOCK_LOGIN_ERROR.statusText
            });
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
            localStorage.setItem('authToken', 'mock-token');
            service.logout();

            expect(service.getToken()).toBeNull();
            expect(service.isAuthenticated()).toBeFalsy();
        });

        it('should clear currentUser on logout', (done) => {
            localStorage.setItem('authToken', VALID_JWT_TOKEN);
            service['loadStoredToken']();

            service.logout();

            service.currentUser$.subscribe(user => {
                expect(user).toBeNull();
                done();
            });
        });

        it('should remove token from localStorage', () => {
            localStorage.setItem('authToken', VALID_JWT_TOKEN);

            service.logout();

            expect(localStorage.getItem('authToken')).toBeNull();
        });
    });

    describe('isAuthenticated Method', () => {
        it('should return true when token is valid', () => {
            localStorage.setItem('authToken', VALID_JWT_TOKEN);

            expect(service.isAuthenticated()).toBeTruthy();
        });

        it('should return false when token is expired', () => {
            localStorage.setItem('authToken', EXPIRED_JWT_TOKEN);

            expect(service.isAuthenticated()).toBeFalsy();
        });

        it('should return false when no token exists', () => {
            expect(service.isAuthenticated()).toBeFalsy();
        });

        it('should return false for malformed token', () => {
            localStorage.setItem('authToken', 'invalid-token');

            expect(service.isAuthenticated()).toBeFalsy();
        });
    });

    describe('getToken Method', () => {
        it('should return stored token', () => {
            localStorage.setItem('authToken', VALID_JWT_TOKEN);

            expect(service.getToken()).toBe(VALID_JWT_TOKEN);
        });

        it('should return null when no token exists', () => {
            expect(service.getToken()).toBeNull();
        });
    });

    describe('getAuthHeaders Method', () => {
        it('should return headers with Authorization when token exists', () => {
            localStorage.setItem('authToken', VALID_JWT_TOKEN);

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
            const mockUser = {
                id: '1',
                email: 'test@example.com',
                name: 'Test User',
                roles: ['USER']
            };

            service['currentUserSubject'].next(mockUser);

            expect(service.getCurrentUser()).toEqual(mockUser);
        });

        it('should return null when no user is logged in', () => {
            expect(service.getCurrentUser()).toBeNull();
        });
    });

    describe('hasRole Method', () => {
        it('should return true when user has the specified role', () => {
            localStorage.setItem('authToken', PARCEIRO_JWT_TOKEN);
            service['loadStoredToken']();

            expect(service.hasRole('PARCEIRO_ACESSEBANK')).toBeTruthy();
        });

        it('should return false when user does not have the role', () => {
            localStorage.setItem('authToken', PARCEIRO_JWT_TOKEN);
            service['loadStoredToken']();

            expect(service.hasRole('ADMIN')).toBeFalsy();
        });

        it('should return false when user is not logged in', () => {
            expect(service.hasRole('USER')).toBeFalsy();
        });

        it('should return false when user has no roles', () => {
            service['currentUserSubject'].next(MOCK_USER_NO_ROLES);

            expect(service.hasRole('USER')).toBeFalsy();
        });
    });

    describe('hasAnyRole Method', () => {
        it('should return true when user has any of the specified roles', () => {
            service['currentUserSubject'].next(MOCK_EDITOR_USER);

            expect(service.hasAnyRole(['ADMIN', 'EDITOR'])).toBeTruthy();
        });

        it('should return false when user has none of the specified roles', () => {
            service['currentUserSubject'].next(MOCK_USER);

            expect(service.hasAnyRole(['ADMIN', 'SUPER_USER'])).toBeFalsy();
        });

        it('should return false when user is not logged in', () => {
            expect(service.hasAnyRole(['USER', 'ADMIN'])).toBeFalsy();
        });

        it('should return false when user has no roles', () => {
            service['currentUserSubject'].next(MOCK_USER_NO_ROLES);

            expect(service.hasAnyRole(['USER', 'ADMIN'])).toBeFalsy();
        });

        it('should return true when user has all specified roles', () => {
            service['currentUserSubject'].next(MOCK_MULTI_ROLE_USER);

            expect(service.hasAnyRole(['USER', 'ADMIN'])).toBeTruthy();
        });
    });

    describe('Token Expiration and Decoding', () => {
        it('should correctly decode valid JWT token', () => {
            localStorage.setItem('authToken', VALID_JWT_TOKEN);
            service['loadStoredToken']();

            const user = service.getCurrentUser();
            expect(user.sub).toBe('1');
            expect(user.email).toBe('test@example.com');
        });

        it('should handle malformed token gracefully', () => {
            localStorage.setItem('authToken', INVALID_JWT_TOKEN);

            expect(() => service['loadStoredToken']()).not.toThrow();
            // Token malformado causa erro no decode, resultando na remoção do token
            expect(service.getCurrentUser()).toBeNull();
        });

        it('should remove expired token on load', () => {
            localStorage.setItem('authToken', EXPIRED_JWT_TOKEN);
            service['loadStoredToken']();

            expect(service.getCurrentUser()).toBeNull();
        });
    });

    describe('Integration Tests', () => {
        it('should complete full authentication flow', (done) => {
            // Login
            service.login(MOCK_LOGIN_REQUEST).subscribe(response => {
                expect(service.isAuthenticated()).toBeTruthy();
                expect(service.hasRole('USER')).toBeTruthy();
                expect(service.hasRole('ADMIN')).toBeFalsy(); // MOCK_LOGIN_RESPONSE tem apenas 'USER'

                // Logout
                service.logout();
                expect(service.isAuthenticated()).toBeFalsy();
                expect(service.getCurrentUser()).toBeNull();

                done();
            });

            const req = httpMock.expectOne('/api/v1/auth/login');
            req.flush(MOCK_LOGIN_RESPONSE);
        });

        it('should persist authentication across service instances', () => {
            service.login(MOCK_LOGIN_REQUEST).subscribe(() => {
                // Criar nova instância do serviço
                const httpClient = TestBed.inject(HttpClient);
                const newService = new AuthService(httpClient);

                expect(newService.getToken()).toBe(VALID_JWT_TOKEN);
            });

            const req = httpMock.expectOne('/api/v1/auth/login');
            req.flush(MOCK_LOGIN_RESPONSE);
        });

        it('should handle multiple role checks efficiently', () => {
            service['currentUserSubject'].next(MOCK_MULTI_ROLE_USER);

            expect(service.hasRole('USER')).toBeTruthy();
            expect(service.hasRole('ADMIN')).toBeTruthy();
            expect(service.hasRole('EDITOR')).toBeTruthy();
            expect(service.hasRole('MODERATOR')).toBeTruthy();
            expect(service.hasRole('SUPER_ADMIN')).toBeFalsy();

            expect(service.hasAnyRole(['SUPER_ADMIN', 'USER'])).toBeTruthy();
            expect(service.hasAnyRole(['SUPER_ADMIN', 'OWNER'])).toBeFalsy();
        });
    });
});
