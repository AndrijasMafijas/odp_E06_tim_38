import type { IAuthAPIService } from "../../../api_services/auth/IAuthAPIService";
import type { UserLoginDto } from "../../../models/auth/UserLoginDto";

export type AuthFormProps = {
  authApi: IAuthAPIService;
  onLoginSuccess: (user?: UserLoginDto) => void;
};
