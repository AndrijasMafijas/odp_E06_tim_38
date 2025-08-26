export function validacijaPodatakaUser(userData: any) {
  if (!userData.korisnickoIme || typeof userData.korisnickoIme !== 'string' || userData.korisnickoIme.trim() === '') {
    return { uspesno: false, poruka: 'Korisničko ime je obavezno.' };
  }
  if (!userData.email || typeof userData.email !== 'string' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(userData.email)) {
    return { uspesno: false, poruka: 'Email nije validan.' };
  }
  if (userData.lozinka && (typeof userData.lozinka !== 'string' || userData.lozinka.length < 6)) {
    return { uspesno: false, poruka: 'Lozinka mora imati najmanje 6 karaktera.' };
  }
  if (userData.uloga && userData.uloga !== 'korisnik' && userData.uloga !== 'admin') {
    return { uspesno: false, poruka: 'Uloga mora biti korisnik ili admin.' };
  }
  return { uspesno: true };
}
