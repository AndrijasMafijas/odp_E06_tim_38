import express from 'express';
import cors from 'cors';
import { IAuthService } from './Domain/services/auth/IAuthService';
import { AuthService } from './Services/auth/AuthService';
import { IUserRepository } from './Domain/repositories/users/IUserRepository';
import { UserRepository } from './Database/repositories/users/UserRepository';
import { AuthController } from './WebAPI/controllers/AuthController';
import { authMiddleware } from './WebAPI/middlewere/authMiddleware';

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Repositories
const userRepository: IUserRepository = new UserRepository();

// Services
const authService: IAuthService = new AuthService(userRepository);

// WebAPI routes
const authController = new AuthController(authService);

// Registering routes
app.use('/api/v1',authController.getRouter());

export default app;