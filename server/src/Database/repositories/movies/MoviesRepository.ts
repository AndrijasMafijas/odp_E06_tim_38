import { Movie } from "../../../Domain/models/Movie";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";
import { IMoviesRepository } from "../../../Domain/repositories/movies/IMoviesRepository";

export class MoviesRepository implements IMoviesRepository {
  async create(movie: Movie): Promise<Movie> {
    try {
      const query = `
        INSERT INTO movies (naziv, opis, trajanje, zanr, godinaIzdanja, prosecnaOcena)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const [result] = await db.execute<ResultSetHeader>(query, [
        movie.naziv,
        movie.opis,
        movie.trajanje,
        movie.zanr,
        movie.godinaIzdanja,
        movie.prosecnaOcena
      ]);
      if (result.insertId) {
        return new Movie(result.insertId, movie.naziv, movie.opis, movie.trajanje, movie.zanr, movie.godinaIzdanja, movie.prosecnaOcena);
      }
      return new Movie();
    } catch {
      return new Movie();
    }
  }

  async getById(id: number): Promise<Movie> {
    try {
      const query = `
        SELECT id, naziv, opis, trajanje, zanr, godinaIzdanja, prosecnaOcena
        FROM movies
        WHERE id = ?
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query, [id]);
      if (rows.length > 0) {
        const row = rows[0];
        return new Movie(row.id, row.naziv, row.opis, row.trajanje, row.zanr, row.godinaIzdanja, row.prosecnaOcena);
      }
      return new Movie();
    } catch {
      return new Movie();
    }
  }

  async getAll(): Promise<Movie[]> {
    try {
      const query = `
        SELECT id, naziv, opis, trajanje, zanr, godinaIzdanja, prosecnaOcena
        FROM movies
        ORDER BY id ASC
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query);
      return rows.map(
        (row) => new Movie(row.id, row.naziv, row.opis, row.trajanje, row.zanr, row.godinaIzdanja, row.prosecnaOcena)
      );
    } catch {
      return [];
    }
  }

  async update(movie: Movie): Promise<Movie> {
    try {
      const query = `
        UPDATE movies
        SET naziv = ?, opis = ?, trajanje = ?, zanr = ?, godinaIzdanja = ?, prosecnaOcena = ?
        WHERE id = ?
      `;
      const [result] = await db.execute<ResultSetHeader>(query, [
        movie.naziv,
        movie.opis,
        movie.trajanje,
        movie.zanr,
        movie.godinaIzdanja,
        movie.prosecnaOcena,
        movie.id
      ]);
      if (result.affectedRows > 0) {
        return movie;
      }
      return new Movie();
    } catch {
      return new Movie();
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const query = `
        DELETE FROM movies
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
        FROM movies
        WHERE id = ?
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query, [id]);
      return rows[0].count > 0;
    } catch {
      return false;
    }
  }
}