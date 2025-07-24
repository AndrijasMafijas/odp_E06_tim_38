import { Series } from "../../../Domain/models/Series";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";
import { ISeriesRepository } from "../../../Domain/repositories/series/ISeriesRepository";

export class SeriesRepository implements ISeriesRepository {
  async create(series: Series): Promise<Series> {
    try {
      const query = `
        INSERT INTO series (naziv, opis, brojEpizoda, zanr, godinaIzdanja, prosecnaOcena)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const [result] = await db.execute<ResultSetHeader>(query, [
        series.naziv,
        series.opis,
        series.brojEpizoda,
        series.zanr,
        series.godinaIzdanja,
        series.prosecnaOcena
      ]);
      if (result.insertId) {
        return new Series(result.insertId, series.naziv, series.opis, series.brojEpizoda, series.zanr, series.godinaIzdanja, series.prosecnaOcena);
      }
      return new Series();
    } catch {
      return new Series();
    }
  }

  async getById(id: number): Promise<Series> {
    try {
      const query = `
        SELECT id, naziv, opis, brojEpizoda, zanr, godinaIzdanja, prosecnaOcena
        FROM series
        WHERE id = ?
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query, [id]);
      if (rows.length > 0) {
        const row = rows[0];
        return new Series(row.id, row.naziv, row.opis, row.brojEpizoda, row.zanr, row.godinaIzdanja, row.prosecnaOcena);
      }
      return new Series();
    } catch {
      return new Series();
    }
  }

  async getAll(): Promise<Series[]> {
    try {
      const query = `
        SELECT id, naziv, opis, brojEpizoda, zanr, godinaIzdanja, prosecnaOcena
        FROM series
        ORDER BY id ASC
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query);
      return rows.map(
        (row) => new Series(row.id, row.naziv, row.opis, row.brojEpizoda, row.zanr, row.godinaIzdanja, row.prosecnaOcena)
      );
    } catch {
      return [];
    }
  }

  async update(series: Series): Promise<Series> {
    try {
      const query = `
        UPDATE series
        SET naziv = ?, opis = ?, brojEpizoda = ?, zanr = ?, godinaIzdanja = ?, prosecnaOcena = ?
        WHERE id = ?
      `;
      const [result] = await db.execute<ResultSetHeader>(query, [
        series.naziv,
        series.opis,
        series.brojEpizoda,
        series.zanr,
        series.godinaIzdanja,
        series.prosecnaOcena,
        series.id
      ]);
      if (result.affectedRows > 0) {
        return series;
      }
      return new Series();
    } catch {
      return new Series();
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const query = `
        DELETE FROM series
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
        FROM series
        WHERE id = ?
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query, [id]);
      return rows[0].count > 0;
    } catch {
      return false;
    }
  }
}