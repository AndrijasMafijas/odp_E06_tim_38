export function validacijaPodatakaMovie(movieData: any) {
  if (!movieData.naziv || typeof movieData.naziv !== 'string' || movieData.naziv.trim() === '') {
    return { uspesno: false, poruka: 'Naziv filma je obavezan.' };
  }
  if (movieData.opis && typeof movieData.opis !== 'string') {
    return { uspesno: false, poruka: 'Opis mora biti tekst.' };
  }
  if (movieData.trajanje !== undefined && (isNaN(Number(movieData.trajanje)) || Number(movieData.trajanje) <= 0)) {
    return { uspesno: false, poruka: 'Trajanje mora biti pozitivan broj.' };
  }
  if (movieData.zanr && typeof movieData.zanr !== 'string') {
    return { uspesno: false, poruka: 'Žanr mora biti tekst.' };
  }
  if (movieData.godinaIzdanja !== undefined && (isNaN(Number(movieData.godinaIzdanja)) || Number(movieData.godinaIzdanja) < 1800)) {
    return { uspesno: false, poruka: 'Godina izdanja mora biti validna godina.' };
  }
  if (movieData.prosecnaOcena !== undefined && (isNaN(Number(movieData.prosecnaOcena)) || Number(movieData.prosecnaOcena) < 0 || Number(movieData.prosecnaOcena) > 10)) {
    return { uspesno: false, poruka: 'Prosečna ocena mora biti broj između 0 i 10.' };
  }
  return { uspesno: true };
}
