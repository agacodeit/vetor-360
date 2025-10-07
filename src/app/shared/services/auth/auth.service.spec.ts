import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, LoginRequest, SignupRequest } from './auth.service';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AuthService]
        });
        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
        localStorage.clear();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should login successfully', () => {
        const loginData: LoginRequest = {
            email: 'test@example.com',
            password: 'password123'
        };

        const mockResponse = {
            token: 'mock-jwt-token',
            user: {
                id: '1',
                email: 'test@example.com',
                name: 'Test User',
                roles: ['USER']
            },
            expiresIn: 3600
        };

        service.login(loginData).subscribe(response => {
            expect(response).toEqual(mockResponse);
            expect(service.getToken()).toBe('mock-jwt-token');
            expect(service.isAuthenticated()).toBeTruthy();
        });

        const req = httpMock.expectOne('https://hml.acessebank.com.br/acessebankapi/api/v1/auth/login');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(loginData);
        req.flush(mockResponse);
    });

    it('should signup successfully', () => {
        const signupData: SignupRequest = {
            email: 'newuser@example.com',
            password: 'password123',
            name: 'New User',
            confirmPassword: 'password123'
        };

        const mockResponse = {
            message: 'User created successfully',
            user: {
                id: '2',
                email: 'newuser@example.com',
                name: 'New User'
            }
        };

        service.signup(signupData).subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne('https://hml.acessebank.com.br/acessebankapi/api/v1/auth/signup');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(signupData);
        req.flush(mockResponse);
    });

    it('should logout and clear token', () => {
        localStorage.setItem('authToken', 'mock-token');
        service.logout();

        expect(service.getToken()).toBeNull();
        expect(service.isAuthenticated()).toBeFalsy();
    });

    it('should check if user has specific role', () => {
        const mockToken = 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJBZHZpc29yQmFua2VyIiwiY29kZSI6Ijk2YjQ3ODc5LTVlZGItNDI1Yi04ZDRlLTU4Mzg1NjQ5MDg3MiIsInJvbGVzIjpbIlBBUkNFSVJPX0FDRVNTRUJBTksiXSwiaXNzIjoid3d3Lmlub3ZhY2FydG9yaW9zLmNvbS5iciIsImV4cCI6MTc1Mzc1NTE3NSwiY2xpZW50QWRkcmVzcyI6IjI4MDQ6M2M3NDozZjA6YzZkMDpkMGE2Ojc1ZjE6YzM3MTo0YjI4IiwiZW1haWwiOiJ2YWxpZGFjYW8uYWNlc3NlYmFua2VyQGFjZXNzZWJhbmsuY29tLmJyIiwidGVtcG9yYXJ5UGFzcyI6ZmFsc2V9.cgNsYFHbyszX0_c6tk0y-TjnaWBolvne0kJ0-guzRcAv6ShtPAwf9YPSb9vCYa0YS28e873g8_cvQFMLber-_hFEy4cyM2mWguLAZgR5jlN4PyI88HsvQluUnbrhLLwwgW0_NUILKVOx0vVSgLzwZ17o3zBXpiB-YBXBEpuGBwieTChLhmJsDXXELFkm-Jy7lkt-_BIv3RKE5drgJfCU-7Y2me_ksHF8ezIbXAd8xh2SrDTHbpFLoiQMIdNQiT6T539Ad5qK1fmgY-UYTvdKjh-N30LIlYXuTZ9S_jYEW9HePXOznV-A6wuX-q4mWGYnhkONKx5_Mv_So8YoNMDS-Q';

        localStorage.setItem('authToken', mockToken);
        service['loadStoredToken']();

        expect(service.hasRole('PARCERO_ACESSEBANK')).toBeTruthy();
        expect(service.hasRole('ADMIN')).toBeFalsy();
    });
});
