import { Trivia } from "../../../Domain/models/Trivia";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";
import { ITriviesRepository } from "../../../Domain/repositories/trivies/ITriviesRepository";

export class TriviesRepository implements ITriviesRepository {
  async create(trivia: Trivia): Promise<Trivia> {
    try {
      const query = `
        INSERT INTO trivias (pitanje, odgovor, sadrzajId, tipSadrzaja)
        VALUES (?, ?, ?, ?)
      `;
      const [result] = await db.execute<ResultSetHeader>(query, [
        trivia.pitanje,
        trivia.odgovor,
        trivia.sadrzajId,
        trivia.tipSadrzaja
      ]);
      if (result.insertId) {
        return new Trivia(result.insertId, trivia.pitanje, trivia.odgovor, trivia.sadrzajId, trivia.tipSadrzaja);
      }
      return new Trivia();
    } catch {
      return new Trivia();
    }
  }

  async getById(id: number): Promise<Trivia> {
    try {
      const query = `
        SELECT id, pitanje, odgovor, sadrzajId, tipSadrzaja
        FROM trivias
        WHERE id = ?
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query, [id]);
      if (rows.length > 0) {
        const row = rows[0];
        return new Trivia(row.id, row.pitanje, row.odgovor, row.sadrzajId, row.tipSadrzaja);
      }
      return new Trivia();
    } catch {
      return new Trivia();
    }
  }

  async getAll(): Promise<Trivia[]> {
    try {
      const query = `
        SELECT id, pitanje, odgovor, sadrzajId, tipSadrzaja
        FROM trivias
        ORDER BY id ASC
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query);
      return rows.map(
        (row) => new Trivia(row.id, row.pitanje, row.odgovor, row.sadrzajId, row.tipSadrzaja)
      );
    } catch {
      return [];
    }
  }

  async update(trivia: Trivia): Promise<Trivia> {
    try {
      const query = `
        UPDATE trivias
        SET pitanje = ?, odgovor = ?, sadrzajId = ?, tipSadrzaja = ?
        WHERE id = ?
      `;
      const [result] = await db.execute<ResultSetHeader>(query, [
        trivia.pitanje,
        trivia.odgovor,
        trivia.sadrzajId,
        trivia.tipSadrzaja,
        trivia.id
      ]);
      if (result.affectedRows > 0) {
        return trivia;
      }
      return new Trivia();
    } catch {
      return new Trivia();
    }
  }
  // Dohvati trivije po sadrzaju i tipu sadrzaja
  async getByContent(sadrzajId: number, tipSadrzaja: string): Promise<Trivia[]> {
    try {
      const query = `
        SELECT id, pitanje, odgovor, sadrzajId, tipSadrzaja
        FROM trivias
        WHERE sadrzajId = ? AND tipSadrzaja = ?
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query, [sadrzajId, tipSadrzaja]);
      return rows.map(
        (row) => new Trivia(row.id, row.pitanje, row.odgovor, row.sadrzajId, row.tipSadrzaja)
      );
    } catch {
      return [];
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const query = `
        DELETE FROM trivias
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
        FROM trivias
        WHERE id = ?
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query, [id]);
      return rows[0].count > 0;
    } catch {
      return false;
    }
  }
}