import { User } from '../../models/User';
export interface IUserService {
    // vidi js docs dodas
    register(user: User): Promise<User>;
    login(korisnickoIme: string, lozinka: string): Promise<User>;
    getById(id: number): Promise<User>;
    getAll(): Promise<User[]>;
    update(user: User): Promise<User>;
    delete(id: number): Promise<boolean>;
}