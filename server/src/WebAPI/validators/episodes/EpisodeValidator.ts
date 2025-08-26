export function validacijaPodatakaEpisode(episodeData: any) {
  if (!episodeData.naziv || typeof episodeData.naziv !== 'string' || episodeData.naziv.trim() === '') {
    return { uspesno: false, poruka: 'Naziv epizode je obavezan.' };
  }
  if (episodeData.opis && typeof episodeData.opis !== 'string') {
    return { uspesno: false, poruka: 'Opis mora biti tekst.' };
  }
  if (episodeData.trajanje !== undefined && (isNaN(Number(episodeData.trajanje)) || Number(episodeData.trajanje) <= 0)) {
    return { uspesno: false, poruka: 'Trajanje mora biti pozitivan broj.' };
  }
  if (episodeData.brojEpizode !== undefined && (isNaN(Number(episodeData.brojEpizode)) || Number(episodeData.brojEpizode) <= 0)) {
    return { uspesno: false, poruka: 'Broj epizode mora biti pozitivan broj.' };
  }
  if (episodeData.serijaId !== undefined && (isNaN(Number(episodeData.serijaId)) || Number(episodeData.serijaId) <= 0)) {
    return { uspesno: false, poruka: 'SerijaId mora biti pozitivan broj.' };
  }
  if (episodeData.prosecnaOcena !== undefined && (isNaN(Number(episodeData.prosecnaOcena)) || Number(episodeData.prosecnaOcena) < 0 || Number(episodeData.prosecnaOcena) > 10)) {
    return { uspesno: false, poruka: 'Prosečna ocena mora biti broj između 0 i 10.' };
  }
  return { uspesno: true };
}
