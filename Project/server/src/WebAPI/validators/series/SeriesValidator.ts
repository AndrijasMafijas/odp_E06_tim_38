export function validacijaPodatakaSeries(seriesData: any) {
  if (!seriesData.naziv || typeof seriesData.naziv !== 'string' || seriesData.naziv.trim() === '') {
    return { uspesno: false, poruka: 'Naziv je obavezan.' };
  }
  if (seriesData.opis && typeof seriesData.opis !== 'string') {
    return { uspesno: false, poruka: 'Opis mora biti tekst.' };
  }
  if (seriesData.brojEpizoda !== undefined && (isNaN(Number(seriesData.brojEpizoda)) || Number(seriesData.brojEpizoda) < 0)) {
    return { uspesno: false, poruka: 'Broj epizoda mora biti nenegativan broj.' };
  }
  if (seriesData.zanr && typeof seriesData.zanr !== 'string') {
    return { uspesno: false, poruka: 'Žanr mora biti tekst.' };
  }
  if (seriesData.godinaIzdanja !== undefined && (isNaN(Number(seriesData.godinaIzdanja)) || Number(seriesData.godinaIzdanja) < 1800)) {
    return { uspesno: false, poruka: 'Godina izdanja mora biti validna godina.' };
  }
  if (seriesData.prosecnaOcena !== undefined && (isNaN(Number(seriesData.prosecnaOcena)) || Number(seriesData.prosecnaOcena) < 0 || Number(seriesData.prosecnaOcena) > 10)) {
    return { uspesno: false, poruka: 'Prosečna ocena mora biti broj između 0 i 10.' };
  }
  return { uspesno: true };
}
