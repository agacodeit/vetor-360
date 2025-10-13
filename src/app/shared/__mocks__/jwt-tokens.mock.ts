/**
 * Mock JWT Tokens para testes
 * 
 * Tokens JWT válidos e expirados para uso em testes de autenticação
 */

/**
 * Token JWT válido que expira em 2100
 * Payload: {
 *   sub: "1",
 *   email: "test@example.com",
 *   name: "Test User",
 *   roles: ["USER", "ADMIN"],
 *   exp: 4102444800
 * }
 */
export const VALID_JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwibmFtZSI6IlRlc3QgVXNlciIsInJvbGVzIjpbIlVTRVIiLCJBRE1JTiJdLCJleHAiOjQxMDI0NDQ4MDB9.mock';

/**
 * Token JWT expirado (exp em 2020)
 * Payload: {
 *   sub: "1",
 *   email: "test@example.com",
 *   name: "Test User",
 *   roles: ["USER"],
 *   exp: 1577836800
 * }
 */
export const EXPIRED_JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwibmFtZSI6IlRlc3QgVXNlciIsInJvbGVzIjpbIlVTRVIiXSwiZXhwIjoxNTc3ODM2ODAwfQ.mock';

/**
 * Token JWT válido com role PARCEIRO_ACESSEBANK
 * Usado para testes de autorização específicos
 */
export const PARCEIRO_JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJBZHZpc29yQmFua2VyIiwiY29kZSI6Ijk2YjQ3ODc5LTVlZGItNDI1Yi04ZDRlLTU4Mzg1NjQ5MDg3MiIsInJvbGVzIjpbIlBBUkNFSVJPX0FDRVNTRUJBTksiXSwiaXNzIjoid3d3Lmlub3ZhY2FydG9yaW9zLmNvbS5iciIsImV4cCI6NDEwMjQ0NDgwMCwiY2xpZW50QWRkcmVzcyI6IjI4MDQ6M2M3NDozZjA6YzZkMDpkMGE2Ojc1ZjE6YzM3MTo0YjI4IiwiZW1haWwiOiJ2YWxpZGFjYW8uYWNlc3NlYmFua2VyQGFjZXNzZWJhbmsuY29tLmJyIiwidGVtcG9yYXJ5UGFzcyI6ZmFsc2V9.mock';

/**
 * Token JWT inválido/malformado
 */
export const INVALID_JWT_TOKEN = 'invalid.token.format';

/**
 * Payload decodificado do token válido
 */
export const VALID_TOKEN_PAYLOAD = {
    sub: '1',
    email: 'test@example.com',
    name: 'Test User',
    roles: ['USER', 'ADMIN'],
    exp: 4102444800
};

/**
 * Payload decodificado do token expirado
 */
export const EXPIRED_TOKEN_PAYLOAD = {
    sub: '1',
    email: 'test@example.com',
    name: 'Test User',
    roles: ['USER'],
    exp: 1577836800
};

