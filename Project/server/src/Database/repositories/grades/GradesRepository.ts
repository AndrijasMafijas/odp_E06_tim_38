import { Grade } from "../../../Domain/models/Grade";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";
import { IGradesRepository } from "../../../Domain/repositories/grades/IGradesRepository";

export class GradesRepository implements IGradesRepository {
  async create(grade: Grade): Promise<Grade> {
    try {
      const query = `
        INSERT INTO grades (korisnikId, sadrzajId, ocena, komentar)
        VALUES (?, ?, ?, ?)
      `;
      const [result] = await db.execute<ResultSetHeader>(query, [
        grade.korisnikId,
        grade.sadrzajId,
        grade.ocena,
        grade.komentar
      ]);
      if (result.insertId) {
        return new Grade(result.insertId, grade.korisnikId, grade.sadrzajId, grade.ocena, grade.komentar);
      }
      return new Grade();
    } catch {
      return new Grade();
    }
  }

  async getById(id: number): Promise<Grade> {
    try {
      const query = `
        SELECT id, korisnikId, sadrzajId, ocena, komentar
        FROM grades
        WHERE id = ?
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query, [id]);
      if (rows.length > 0) {
        const row = rows[0];
        return new Grade(row.id, row.korisnikId, row.sadrzajId, row.ocena, row.komentar);
      }
      return new Grade();
    } catch {
      return new Grade();
    }
  }

  async getAll(): Promise<Grade[]> {
    try {
      const query = `
        SELECT id, korisnikId, sadrzajId, ocena, komentar
        FROM grades
        ORDER BY id ASC
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query);
      return rows.map(
        (row) => new Grade(row.id, row.korisnikId, row.sadrzajId, row.ocena, row.komentar)
      );
    } catch {
      return [];
    }
  }

  async update(grade: Grade): Promise<Grade> {
    try {
      const query = `
        UPDATE grades
        SET korisnikId = ?, sadrzajId = ?, ocena = ?, komentar = ?
        WHERE id = ?
      `;
      const [result] = await db.execute<ResultSetHeader>(query, [
        grade.korisnikId,
        grade.sadrzajId,
        grade.ocena,
        grade.komentar,
        grade.id
      ]);
      if (result.affectedRows > 0) {
        return grade;
      }
      return new Grade();
    } catch {
      return new Grade();
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const query = `
        DELETE FROM grades
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
        FROM grades
        WHERE id = ?
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query, [id]);
      return rows[0].count > 0;
    } catch {
      return false;
      }
  }
}