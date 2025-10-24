/**
 * Mock de requisições de autenticação para testes
 */

import { LoginRequest, SignupRequest, LoginResponse, SignupResponse } from '../services/auth/auth.service';
import { VALID_JWT_TOKEN } from './jwt-tokens.mock';
import { MOCK_GESTOR_USER, MOCK_PARCEIRO_USER } from './user-data.mock';

/**
 * Requisição de login Gestor
 */
export const MOCK_LOGIN_REQUEST_GESTOR: LoginRequest = {
    email: 'gestor@acessebank.com.br',
    password: 'senha123'
};

/**
 * Requisição de login Parceiro
 */
export const MOCK_LOGIN_REQUEST_PARCEIRO: LoginRequest = {
    email: 'parceiro@acessebank.com.br',
    password: 'senha123'
};

/**
 * Requisição de login com credenciais inválidas
 */
export const MOCK_INVALID_LOGIN_REQUEST: LoginRequest = {
    email: 'gestor@acessebank.com.br',
    password: 'senhaerrada'
};

/**
 * Requisição de signup padrão
 */
export const MOCK_SIGNUP_REQUEST: SignupRequest = {
    email: 'newuser@example.com',
    password: 'password123',
    name: 'New User',
    cellphone: '11999999999'
};

/**
 * Requisição de signup com email existente
 */
export const MOCK_EXISTING_EMAIL_SIGNUP_REQUEST: SignupRequest = {
    email: 'existing@example.com',
    password: 'password123',
    name: 'New User',
    cellphone: '11999999999'
};

/**
 * Resposta de login bem-sucedido Gestor
 */
export const MOCK_LOGIN_RESPONSE_GESTOR: LoginResponse = {
    token: VALID_JWT_TOKEN,
    user: MOCK_GESTOR_USER,
    expiresIn: 3600
};

/**
 * Resposta de login bem-sucedido Parceiro
 */
export const MOCK_LOGIN_RESPONSE_PARCEIRO: LoginResponse = {
    token: VALID_JWT_TOKEN,
    user: MOCK_PARCEIRO_USER,
    expiresIn: 3600
};

/**
 * Resposta de signup bem-sucedido
 */
export const MOCK_SIGNUP_RESPONSE: SignupResponse = {
    message: 'User created successfully',
    user: MOCK_GESTOR_USER
};

/**
 * Erro de login - credenciais inválidas
 */
export const MOCK_LOGIN_ERROR = {
    status: 401,
    statusText: 'Unauthorized',
    error: {
        message: 'Invalid credentials'
    }
};

/**
 * Erro de signup - email já existe
 */
export const MOCK_SIGNUP_EMAIL_EXISTS_ERROR = {
    status: 409,
    statusText: 'Conflict',
    error: {
        message: 'Email already exists'
    }
};

