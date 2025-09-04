// SOLID-compliant Dependency Injection Container
import type { IMovieService, IMovieRepository } from '../interfaces/IMovieService';
import type { ISeriesService, ISeriesRepository } from '../interfaces/ISeriesService';
import type { ITriviaService, ITriviaRepository } from '../interfaces/ITriviaService';
import type { IUserService, IUserRepository } from '../interfaces/IUserService';
import type { IGradeService, IGradeRepository } from '../interfaces/IGradeService';

// Concrete implementations (imported only for bootstrapping)
import { MovieRepository } from '../repositories/MovieRepository';
import { MovieService } from '../services/MovieService';
import { SeriesRepository } from '../repositories/SeriesRepository';
import { SeriesService } from '../services/SeriesService';
import { TriviaRepository } from '../repositories/TriviaRepository';
import { TriviaService } from '../services/TriviaService';
import { UserRepository } from '../repositories/UserRepository';
import { UserService } from '../services/UserService';
import { GradeRepository } from '../repositories/GradeRepository';
import { GradeService } from '../services/GradeService';

class ServiceFactory {
  // Store interfaces, not concrete implementations (DIP compliance)
  private static movieServiceInstance: IMovieService | null = null;
  private static seriesServiceInstance: ISeriesService | null = null;
  private static triviaServiceInstance: ITriviaService | null = null;
  private static userServiceInstance: IUserService | null = null;
  private static gradeServiceInstance: IGradeService | null = null;

  // Repository instances (DIP compliance)
  private static movieRepositoryInstance: IMovieRepository | null = null;
  private static seriesRepositoryInstance: ISeriesRepository | null = null;
  private static triviaRepositoryInstance: ITriviaRepository | null = null;
  private static userRepositoryInstance: IUserRepository | null = null;
  private static gradeRepositoryInstance: IGradeRepository | null = null;

  // Repository factory methods (following DIP - return interfaces)
  private static getMovieRepository(): IMovieRepository {
    if (!this.movieRepositoryInstance) {
      this.movieRepositoryInstance = new MovieRepository();
    }
    return this.movieRepositoryInstance;
  }

  private static getSeriesRepository(): ISeriesRepository {
    if (!this.seriesRepositoryInstance) {
      this.seriesRepositoryInstance = new SeriesRepository();
    }
    return this.seriesRepositoryInstance;
  }

  private static getTriviaRepository(): ITriviaRepository {
    if (!this.triviaRepositoryInstance) {
      this.triviaRepositoryInstance = new TriviaRepository();
    }
    return this.triviaRepositoryInstance;
  }

  private static getUserRepository(): IUserRepository {
    if (!this.userRepositoryInstance) {
      this.userRepositoryInstance = new UserRepository();
    }
    return this.userRepositoryInstance;
  }

  private static getGradeRepository(): IGradeRepository {
    if (!this.gradeRepositoryInstance) {
      this.gradeRepositoryInstance = new GradeRepository();
    }
    return this.gradeRepositoryInstance;
  }

  // Service factory methods (following DIP - injecting interfaces)
  static getMovieService(): IMovieService {
    if (!this.movieServiceInstance) {
      const movieRepository = this.getMovieRepository(); // Inject interface
      this.movieServiceInstance = new MovieService(movieRepository);
    }
    return this.movieServiceInstance;
  }

  static getSeriesService(): ISeriesService {
    if (!this.seriesServiceInstance) {
      const seriesRepository = this.getSeriesRepository(); // Inject interface
      this.seriesServiceInstance = new SeriesService(seriesRepository);
    }
    return this.seriesServiceInstance;
  }

  static getTriviaService(): ITriviaService {
    if (!this.triviaServiceInstance) {
      const triviaRepository = this.getTriviaRepository(); // Inject interface
      this.triviaServiceInstance = new TriviaService(triviaRepository);
    }
    return this.triviaServiceInstance;
  }

  static getUserService(): IUserService {
    if (!this.userServiceInstance) {
      const userRepository = this.getUserRepository(); // Inject interface
      this.userServiceInstance = new UserService(userRepository);
    }
    return this.userServiceInstance;
  }

  static getGradeService(): IGradeService {
    if (!this.gradeServiceInstance) {
      const gradeRepository = this.getGradeRepository(); // Inject interface
      this.gradeServiceInstance = new GradeService(gradeRepository);
    }
    return this.gradeServiceInstance;
  }

  // Method to inject custom implementations (for testing or different environments)
  static configure(config: {
    movieRepository?: IMovieRepository;
    seriesRepository?: ISeriesRepository;
    triviaRepository?: ITriviaRepository;
    userRepository?: IUserRepository;
    gradeRepository?: IGradeRepository;
  }) {
    if (config.movieRepository) this.movieRepositoryInstance = config.movieRepository;
    if (config.seriesRepository) this.seriesRepositoryInstance = config.seriesRepository;
    if (config.triviaRepository) this.triviaRepositoryInstance = config.triviaRepository;
    if (config.userRepository) this.userRepositoryInstance = config.userRepository;
    if (config.gradeRepository) this.gradeRepositoryInstance = config.gradeRepository;
    
    // Reset services to force re-creation with new dependencies
    this.movieServiceInstance = null;
    this.seriesServiceInstance = null;
    this.triviaServiceInstance = null;
    this.userServiceInstance = null;
    this.gradeServiceInstance = null;
  }

  // Method to reset all instances (useful for testing)
  static reset() {
    this.movieServiceInstance = null;
    this.seriesServiceInstance = null;
    this.triviaServiceInstance = null;
    this.userServiceInstance = null;
    this.gradeServiceInstance = null;
    this.movieRepositoryInstance = null;
    this.seriesRepositoryInstance = null;
    this.triviaRepositoryInstance = null;
    this.userRepositoryInstance = null;
    this.gradeRepositoryInstance = null;
  }
}

// Export both named and default for backward compatibility
export { ServiceFactory };
export default ServiceFactory;
