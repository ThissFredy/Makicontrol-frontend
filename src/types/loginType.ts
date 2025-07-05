/**
 * Define las credenciales para el inicio de sesión.
 */
export interface LoginCredentials {
    email: string;
    password: string;
}

/**
 * Define la estructura de los datos devueltos en una respuesta de login exitosa.
 */
export interface LoginResponse {
    token: string;
}
