import type { UserLoginDto } from "../../models/auth/UserLoginDto";

/**
 * Rezultat autentifikacije (prijave/registracije).
 */
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: UserLoginDto;
}