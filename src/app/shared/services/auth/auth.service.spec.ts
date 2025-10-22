import { AuthService } from './auth.service';

describe('AuthService', () => {
    it('should create', () => {
        let service: AuthService;
        service = new AuthService(null as any, null as any);
        expect(service).toBeTruthy();
    });

});
