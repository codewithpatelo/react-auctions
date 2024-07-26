import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Response } from 'express';
import { Request } from 'express';
import { mock, MockProxy } from 'jest-mock-extended';

// Mocks
const mockAuthService = mock<AuthService>();
const mockResponse = mock<Response>();

describe('AuthController', () => {
    let authController: AuthController;
    let authService: MockProxy<AuthService>;
    let res: MockProxy<Response>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService) as unknown as MockProxy<AuthService>;
        res = mock<Response>();
    });

    describe('login', () => {
        it('should return access token and set cookie on successful login', async () => {
            const user = { id: 1, email: 'test@example.com', password: 'password' };
            const auth = { access_token: 'jwt-token', user_id: 1 };

            authService.validateUser.mockResolvedValue(user);
            authService.login.mockResolvedValue(auth);

            const body = { email: 'test@example.com', password: 'password' };

            await authController.login(body, res);

            expect(authService.validateUser).toHaveBeenCalledWith(body.email, body.password);
            expect(authService.login).toHaveBeenCalledWith(user);
            expect(res.cookie).toHaveBeenCalledWith('access_token', auth.access_token, { httpOnly: true });
            expect(res.json).toHaveBeenCalledWith({ access_token: auth.access_token, user_id: auth.user_id });
        });
    });
    describe('register', () => {
        it('should return success message on successful registration', async () => {
            authService.register.mockResolvedValue(undefined);

            const body = { email: 'newuser@example.com', password: 'password' };

            const result = await authController.register(body);

            expect(authService.register).toHaveBeenCalledWith(body.email, body.password);
            expect(result).toBe('User registered');
        });
    });

    describe('getProfile', () => {
        it('should return user profile on successful authorization', async () => {
            const userId = 1;
            const profile = { id: userId, email: 'test@example.com', password: 'password' }; // Incluye password aquí

            // Utilizamos un tipo más específico para Request
            const req = {
                user: { id: userId },
            } as unknown as Request; // Ajustamos el tipo de Request

            authService.getProfile.mockResolvedValue(profile);

            const result = await authController.getProfile(req);

            expect(authService.getProfile).toHaveBeenCalledWith(userId);
            expect(result).toEqual(profile);
        });
    });
});
