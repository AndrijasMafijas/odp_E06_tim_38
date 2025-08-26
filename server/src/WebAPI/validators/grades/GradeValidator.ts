export function validacijaPodatakaGrade(gradeData: any) {
  if (gradeData.korisnikId === undefined || isNaN(Number(gradeData.korisnikId)) || Number(gradeData.korisnikId) <= 0) {
    return { uspesno: false, poruka: 'KorisnikId je obavezan i mora biti pozitivan broj.' };
  }
  if (gradeData.sadrzajId === undefined || isNaN(Number(gradeData.sadrzajId)) || Number(gradeData.sadrzajId) <= 0) {
    return { uspesno: false, poruka: 'SadrzajId je obavezan i mora biti pozitivan broj.' };
  }
  if (gradeData.ocena === undefined || isNaN(Number(gradeData.ocena)) || Number(gradeData.ocena) < 0 || Number(gradeData.ocena) > 10) {
    return { uspesno: false, poruka: 'Ocena mora biti broj između 0 i 10.' };
  }
  if (gradeData.komentar && typeof gradeData.komentar !== 'string') {
    return { uspesno: false, poruka: 'Komentar mora biti tekst.' };
  }
  return { uspesno: true };
}
