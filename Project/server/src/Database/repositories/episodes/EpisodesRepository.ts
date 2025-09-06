import { Episode } from "../../../Domain/models/Episode";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";
import { IEpisodesRepository } from "../../../Domain/repositories/episodes/IEpisodesRepository";

export class EpisodesRepository implements IEpisodesRepository {
  async create(episode: Episode): Promise<Episode> {
    try {
      const query = `
        INSERT INTO episodes (naziv, opis, trajanje, brojEpizode, serijaId, prosecnaOcena, cover_image)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const [result] = await db.execute<ResultSetHeader>(query, [
        episode.naziv,
        episode.opis,
        episode.trajanje,
        episode.brojEpizode,
        episode.serijaId,
        episode.prosecnaOcena,
        episode.cover_image || null
      ]);
      if (result.insertId) {
        return new Episode(result.insertId, episode.naziv, episode.opis, episode.trajanje, episode.brojEpizode, episode.serijaId, episode.prosecnaOcena, episode.cover_image);
      }
      return new Episode();
    } catch {
      return new Episode();
    }
  }

  async getById(id: number): Promise<Episode> {
    try {
      const query = `
        SELECT id, naziv, opis, trajanje, brojEpizode, serijaId, prosecnaOcena, cover_image
        FROM episodes
        WHERE id = ?
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query, [id]);
      if (rows.length > 0) {
        const row = rows[0];
        return new Episode(row.id, row.naziv, row.opis, row.trajanje, row.brojEpizode, row.serijaId, row.prosecnaOcena, row.cover_image);
      }
      return new Episode();
    } catch {
      return new Episode();
    }
  }

  async getAll(): Promise<Episode[]> {
    try {
      const query = `
        SELECT id, naziv, opis, trajanje, brojEpizode, serijaId, prosecnaOcena, cover_image
        FROM episodes
        ORDER BY id ASC
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query);
      return rows.map(
        (row) => new Episode(row.id, row.naziv, row.opis, row.trajanje, row.brojEpizode, row.serijaId, row.prosecnaOcena, row.cover_image)
      );
    } catch {
      return [];
    }
  }

  async update(episode: Episode): Promise<Episode> {
    try {
      const query = `
        UPDATE episodes
        SET naziv = ?, opis = ?, trajanje = ?, brojEpizode = ?, serijaId = ?, prosecnaOcena = ?, cover_image = ?
        WHERE id = ?
      `;
      const [result] = await db.execute<ResultSetHeader>(query, [
        episode.naziv,
        episode.opis,
        episode.trajanje,
        episode.brojEpizode,
        episode.serijaId,
        episode.prosecnaOcena,
        episode.cover_image || null,
        episode.id
      ]);
      if (result.affectedRows > 0) {
        return episode;
      }
      return new Episode();
    } catch {
      return new Episode();
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const query = `
        DELETE FROM episodes
        WHERE id = ?
      `;
      const [result] = await db.execute<ResultSetHeader>(query, [id]);
      return result.affectedRows > 0;
    } catch {
      return false;
    }
  }

  async getBySeriesId(seriesId: number): Promise<Episode[]> {
    try {
      const query = `
        SELECT id, naziv, opis, trajanje, brojEpizode, serijaId, prosecnaOcena, cover_image
        FROM episodes
        WHERE serijaId = ?
        ORDER BY brojEpizode ASC
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query, [seriesId]);
      return rows.map(
        (row) => new Episode(row.id, row.naziv, row.opis, row.trajanje, row.brojEpizode, row.serijaId, row.prosecnaOcena, row.cover_image)
      );
    } catch {
      return [];
    }
  }

  async exists(id: number): Promise<boolean> {
    try {
      const query = `
        SELECT COUNT(*) as count
        FROM episodes
        WHERE id = ?
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query, [id]);
      return rows[0].count > 0;
    } catch {
      return false;
    }
  }
}