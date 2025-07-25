import express from 'express';
import cors from 'cors';
import { AuthController } from './WebAPI/controllers/AuthController';
import { AuthService } from './Services/auth/AuthService';
import { IAuthService } from './Domain/services/auth/IAuthService';
import { UserRepository } from './Database/repositories/users/UserRepository';
import { IUserRepository } from './Domain/repositories/users/IUserRepository';
import { UserController } from './WebAPI/controllers/UserController';
import { EpisodeController } from './WebAPI/controllers/EpisodeController';
import { GradeController } from './WebAPI/controllers/GradeController';
import { MovieController } from './WebAPI/controllers/MovieController';
import { SeriesController } from './WebAPI/controllers/SeriesController';
import { TriviaController } from './WebAPI/controllers/TriviaController';

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
const userRepository: IUserRepository = new UserRepository();
const authService: IAuthService = new AuthService(userRepository);
const authController = new AuthController(authService);
const userController = new UserController();
const episodeController = new EpisodeController();
const gradeController = new GradeController();
const movieController = new MovieController();
const seriesController = new SeriesController();
const triviaController = new TriviaController();

// Registering routes
app.use('/api/v1', authController.getRouter());
app.use('/api/v1', userController.getRouter());
app.use('/api/v1', episodeController.getRouter());
app.use('/api/v1', gradeController.getRouter());
app.use('/api/v1', movieController.getRouter());
app.use('/api/v1', seriesController.getRouter());
app.use('/api/v1', triviaController.getRouter());

export default app;