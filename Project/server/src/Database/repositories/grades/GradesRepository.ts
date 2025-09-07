 
import { Grade } from "../../../Domain/models/Grade";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";
import { IGradesRepository } from "../../../Domain/repositories/grades/IGradesRepository";

export class GradesRepository implements IGradesRepository {
  async create(grade: Grade): Promise<Grade> {
    try {
      const query = `
        INSERT INTO grades (korisnikId, sadrzajId, tipSadrzaja, ocena, komentar)
        VALUES (?, ?, ?, ?, ?)
      `;
      const [result] = await db.execute<ResultSetHeader>(query, [
        grade.korisnikId,
        grade.sadrzajId,
        grade.tipSadrzaja,
        grade.ocena,
        grade.komentar
      ]);
      if (result.insertId) {
        await this.azurirajProsecnuOcenu(grade.sadrzajId, grade.tipSadrzaja);
        return new Grade(result.insertId, grade.korisnikId, grade.sadrzajId, grade.tipSadrzaja, grade.ocena, grade.komentar);
      }
      return new Grade();
    } catch {
      return new Grade();
    }
  }

  async getById(id: number): Promise<Grade> {
    try {
      const query = `
        SELECT id, korisnikId, sadrzajId, tipSadrzaja, ocena, komentar
        FROM grades
        WHERE id = ?
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query, [id]);
      if (rows.length > 0) {
        const row = rows[0];
        return new Grade(row.id, row.korisnikId, row.sadrzajId, row.tipSadrzaja, row.ocena, row.komentar);
      }
      return new Grade();
    } catch {
      return new Grade();
    }
  }

  async getAll(): Promise<Grade[]> {
    try {
      const query = `
        SELECT id, korisnikId, sadrzajId, tipSadrzaja, ocena, komentar
        FROM grades
        ORDER BY id ASC
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query);
      return rows.map(
        (row) => new Grade(row.id, row.korisnikId, row.sadrzajId, row.tipSadrzaja, row.ocena, row.komentar)
      );
    } catch {
      return [];
    }
  }

  async update(grade: Grade): Promise<Grade> {
    try {
      const query = `
        UPDATE grades
        SET korisnikId = ?, sadrzajId = ?, tipSadrzaja = ?, ocena = ?, komentar = ?
        WHERE id = ?
      `;
      const [result] = await db.execute<ResultSetHeader>(query, [
        grade.korisnikId,
        grade.sadrzajId,
        grade.tipSadrzaja,
        grade.ocena,
        grade.komentar,
        grade.id
      ]);
      if (result.affectedRows > 0) {
        await this.azurirajProsecnuOcenu(grade.sadrzajId, grade.tipSadrzaja);
        return grade;
      }
      return new Grade();
    } catch (error) {
      return new Grade();
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      // Prvo dohvatamo ocenu da bismo znali sadrzajId i tipSadrzaja
      const grade = await this.getById(id);
      const query = `
        DELETE FROM grades
        WHERE id = ?
      `;
      const [result] = await db.execute<ResultSetHeader>(query, [id]);
      if (result.affectedRows > 0) {
        await this.azurirajProsecnuOcenu(grade.sadrzajId, grade.tipSadrzaja);
        return true;
      }
      return false;
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

  // Proverava da li korisnik već ima ocenu za određeni sadržaj
  async userHasGraded(korisnikId: number, sadrzajId: number, tipSadrzaja: string): Promise<boolean> {
    try {
      const query = `
        SELECT COUNT(*) as count
        FROM grades
        WHERE korisnikId = ? AND sadrzajId = ? AND tipSadrzaja = ?
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query, [korisnikId, sadrzajId, tipSadrzaja]);
      return rows[0].count > 0;
    } catch {
      return false;
    }
  }

   // Funkcija za ažuriranje prosečne ocene u movies ili episodes ili series
  private async azurirajProsecnuOcenu(sadrzajId: number, tipSadrzaja: string): Promise<void> {
    let tabela = '';
    if (tipSadrzaja === 'movie') tabela = 'movies';
    else if (tipSadrzaja === 'episode') tabela = 'episodes';
    else if (tipSadrzaja === 'series') tabela = 'series';
    else return;
    const queryProsek = `SELECT AVG(ocena) as prosecna FROM grades WHERE sadrzajId = ? AND tipSadrzaja = ?`;
    const [rows] = await db.execute<RowDataPacket[]>(queryProsek, [sadrzajId, tipSadrzaja]);
    const prosecna = rows[0]?.prosecna || 0;
    
    const queryUpdate = `UPDATE ${tabela} SET prosecnaOcena = ? WHERE id = ?`;
    await db.execute<ResultSetHeader>(queryUpdate, [prosecna, sadrzajId]);
  }
}