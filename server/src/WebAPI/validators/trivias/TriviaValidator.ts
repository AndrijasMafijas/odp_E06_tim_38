export function validacijaPodatakaTrivia(triviaData: any) {
  if (!triviaData.pitanje || typeof triviaData.pitanje !== 'string' || triviaData.pitanje.trim() === '') {
    return { uspesno: false, poruka: 'Pitanje je obavezno.' };
  }
  if (!triviaData.odgovor || typeof triviaData.odgovor !== 'string' || triviaData.odgovor.trim() === '') {
    return { uspesno: false, poruka: 'Odgovor je obavezan.' };
  }
  if (triviaData.sadrzajId === undefined || isNaN(Number(triviaData.sadrzajId)) || Number(triviaData.sadrzajId) <= 0) {
    return { uspesno: false, poruka: 'SadrzajId je obavezan i mora biti pozitivan broj.' };
  }
  return { uspesno: true };
}
