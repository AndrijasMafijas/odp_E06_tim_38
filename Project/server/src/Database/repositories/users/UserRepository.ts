import { IUserRepository } from "../../../Domain/repositories/users/IUserRepository";
import { User } from "../../../Domain/models/User";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";

export class UserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    try {
      const query = `
        INSERT INTO users (korisnickoIme, lozinka, email, uloga) 
        VALUES (?, ?, ?, ?)
      `;
      //console.log("Executing query:", query, "with values:", user.korisnickoIme, user.lozinka, user.email, user.uloga);
      const [result] = await db.execute<ResultSetHeader>(query, [
        user.korisnickoIme,
        user.lozinka,
        user.email,
        user.uloga
      ]);

      if (result.insertId) {
        // Vraćamo novog korisnika sa dodeljenim ID-om
        return new User(result.insertId, user.korisnickoIme, user.lozinka, user.email, user.uloga);
      }

      // Vraćamo prazan objekat ako kreiranje nije uspešno
      return new User();
    } catch {
      return new User();
    }
  }

  async getById(id: number): Promise<User> {
    try {
      const query = `
        SELECT id, korisnickoIme, lozinka, email, uloga 
        FROM users 
        WHERE id = ?
      `;

      const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

      if (rows.length > 0) {
        const row = rows[0];
        return new User(row.id, row.korisnickoIme, row.lozinka, row.email, row.uloga);
      }

      return new User();
    } catch {
      return new User();
    }
  }

  async getByUsername(korisnickoIme: string): Promise<User> {
    try {
      const query = `
        SELECT id, korisnickoIme, lozinka, email, uloga 
        FROM users 
        WHERE korisnickoIme = ?
      `;

      const [rows] = await db.execute<RowDataPacket[]>(query, [korisnickoIme]);

      if (rows.length > 0) {
        const row = rows[0];
        return new User(row.id, row.korisnickoIme, row.lozinka, row.email, row.uloga);
      }

      return new User();
    } catch {
      return new User();
    }
  }

  async getAll(): Promise<User[]> {
    try {
      const query = `
        SELECT id, korisnickoIme, lozinka, email, uloga 
        FROM users 
        ORDER BY id ASC
      `;

      const [rows] = await db.execute<RowDataPacket[]>(query);

      return rows.map(
        (row) => new User(row.id, row.korisnickoIme, row.lozinka, row.email, row.uloga)
      );
    } catch {
      return [];
    }
  }

  async update(user: User): Promise<User> {
    try {
      const query = `
        UPDATE users 
        SET korisnickoIme = ?, lozinka = ?, email = ?, uloga = ? 
        WHERE id = ?
      `;

      const [result] = await db.execute<ResultSetHeader>(query, [
        user.korisnickoIme,
        user.lozinka,
        user.email,
        user.uloga,
        user.id,
      ]);

      if (result.affectedRows > 0) {
        return user;
      }

      return new User();
    } catch {
      return new User();
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const query = `
        DELETE FROM users 
        WHERE id = ?
      `;

      const [result] = await db.execute<ResultSetHeader>(query, [id]);

      return result.affectedRows > 0;
    } catch {
      return false;
    }
  }

  async exists(id: number): Promise<boolean> {
    try {
      const query = `
        SELECT COUNT(*) as count 
        FROM users 
        WHERE id = ?
      `;

      const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

      return rows[0].count > 0;
    } catch {
      return false;
    }
  }

  async updateRole(id: number, uloga: string): Promise<boolean> {
    try {
      const query = `
        UPDATE users 
        SET uloga = ?
        WHERE id = ?
      `;
      
      const [result] = await db.execute<ResultSetHeader>(query, [uloga, id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Greška pri ažuriranju uloge:", error);
      return false;
    }
  }
}