export function validacijaPodatakaGrade(gradeData: any) {
  // Prihvatamo i client format (userId, contentId, value) i server format (korisnikId, sadrzajId, ocena)
  const korisnikId = gradeData.userId || gradeData.korisnikId;
  const sadrzajId = gradeData.contentId || gradeData.sadrzajId;
  const ocena = gradeData.value || gradeData.ocena;
  
  if (korisnikId === undefined || isNaN(Number(korisnikId)) || Number(korisnikId) <= 0) {
    return { uspesno: false, poruka: 'ID korisnika је обавезан и мора бити позитиван број.' };
  }
  if (sadrzajId === undefined || isNaN(Number(sadrzajId)) || Number(sadrzajId) <= 0) {
    return { uspesno: false, poruka: 'ID садржаја је обавезан и мора бити позитиван број.' };
  }
  if (ocena === undefined || isNaN(Number(ocena)) || Number(ocena) < 1 || Number(ocena) > 10) {
    return { uspesno: false, poruka: 'Оцена мора бити број између 1 и 10.' };
  }
  if (gradeData.komentar && typeof gradeData.komentar !== 'string') {
    return { uspesno: false, poruka: 'Коментар мора бити текст.' };
  }
  return { uspesno: true };
}
