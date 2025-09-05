import { Movie } from "../../../Domain/models/Movie";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";
import { IMoviesRepository } from "../../../Domain/repositories/movies/IMoviesRepository";

export class MoviesRepository implements IMoviesRepository {
  async create(movie: Movie): Promise<Movie> {
    try {
      const query = `
        INSERT INTO movies (naziv, opis, trajanje, zanr, godinaIzdanja, prosecnaOcena, cover_image)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const [result] = await db.execute<ResultSetHeader>(query, [
        movie.naziv,
        movie.opis,
        movie.trajanje,
        movie.zanr,
        movie.godinaIzdanja,
        movie.prosecnaOcena,
        movie.coverImage
      ]);
      if (result.insertId) {
        return new Movie(result.insertId, movie.naziv, movie.opis, movie.trajanje, movie.zanr, movie.godinaIzdanja, movie.prosecnaOcena, movie.coverImage);
      }
      return new Movie();
    } catch {
      return new Movie();
    }
  }

  async getById(id: number): Promise<Movie> {
    try {
      const query = `
        SELECT id, naziv, opis, trajanje, zanr, godinaIzdanja, prosecnaOcena, cover_image
        FROM movies
        WHERE id = ?
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query, [id]);
      if (rows.length > 0) {
        const row = rows[0];
        return new Movie(row.id, row.naziv, row.opis, row.trajanje, row.zanr, row.godinaIzdanja, row.prosecnaOcena, row.cover_image || '');
      }
      return new Movie();
    } catch {
      return new Movie();
    }
  }

  async getAll(): Promise<Movie[]> {
    try {
      console.log('MoviesRepository.getAll() - Pozivam SQL query...');
      const query = `
        SELECT id, naziv, opis, trajanje, zanr, godinaIzdanja, prosecnaOcena, cover_image
        FROM movies
        ORDER BY id ASC
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query);
      console.log(`MoviesRepository.getAll() - Broj redova: ${rows.length}`);
      if (rows.length > 0) {
        console.log('Prvi red:', JSON.stringify(rows[0], null, 2));
      }
      return rows.map(
        (row) => {
          const movie = new Movie(row.id, row.naziv, row.opis, row.trajanje, row.zanr, row.godinaIzdanja, row.prosecnaOcena, row.cover_image || '');
          console.log(`Movie ${movie.id}: coverImage length = ${movie.coverImage?.length || 0}`);
          return movie;
        }
      );
    } catch (error) {
      console.error('Greška u MoviesRepository.getAll():', error);
      return [];
    }
  }

  async update(movie: Movie): Promise<Movie> {
    try {
      const query = `
        UPDATE movies
        SET naziv = ?, opis = ?, trajanje = ?, zanr = ?, godinaIzdanja = ?, prosecnaOcena = ?, cover_image = ?
        WHERE id = ?
      `;
      const [result] = await db.execute<ResultSetHeader>(query, [
        movie.naziv,
        movie.opis,
        movie.trajanje,
        movie.zanr,
        movie.godinaIzdanja,
        movie.prosecnaOcena,
        movie.coverImage,
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