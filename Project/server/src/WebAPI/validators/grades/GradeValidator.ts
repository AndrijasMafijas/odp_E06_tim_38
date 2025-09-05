export function validacijaPodatakaGrade(gradeData: any) {
  // Prihvatamo i client format (userId, contentId, value) i server format (korisnikId, sadrzajId, ocena)
  const korisnikId = gradeData.userId || gradeData.korisnikId;
  const sadrzajId = gradeData.contentId || gradeData.sadrzajId;
  const ocena = gradeData.value || gradeData.ocena;
  
  if (korisnikId === undefined || isNaN(Number(korisnikId)) || Number(korisnikId) <= 0) {
    return { uspesno: false, poruka: 'ID korisnika je obavezan i mora biti pozitivan broj.' };
  }
  if (sadrzajId === undefined || isNaN(Number(sadrzajId)) || Number(sadrzajId) <= 0) {
    return { uspesno: false, poruka: 'ID sadržaja je obavezan i mora biti pozitivan broj.' };
  }
  if (ocena === undefined || isNaN(Number(ocena)) || Number(ocena) < 1 || Number(ocena) > 10) {
    return { uspesno: false, poruka: 'Ocena mora biti broj između 1 i 10.' };
  }
  if (gradeData.komentar && typeof gradeData.komentar !== 'string') {
    return { uspesno: false, poruka: 'Komentar mora biti tekst.' };
  }
  return { uspesno: true };
}
