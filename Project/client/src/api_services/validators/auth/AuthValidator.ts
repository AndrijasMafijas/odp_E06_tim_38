import type { RezultatValidacije } from "../../../types/validation/ValidationResult";

export function validacijaPodatakaAuth(korisnickoIme?: string, lozinka?: string, email?: string): RezultatValidacije {
  if (!korisnickoIme || !lozinka) {
    return { uspesno: false, poruka: 'Korisničko ime i lozinka su obavezni.' };
  }

  if (korisnickoIme.length < 3) {
    return { uspesno: false, poruka: 'Korisničko ime mora imati najmanje 3 karaktera.' };
  }

  if (lozinka.length < 6) {
    return { uspesno: false, poruka: 'Lozinka mora imati najmanje 6 karaktera.' };
  }

  if (lozinka.length > 20) {
    return { uspesno: false, poruka: 'Lozinka može imati najviše 20 karaktera.' };
  }

  if (email !== undefined) {
    if (!email) {
      return { uspesno: false, poruka: 'Email je obavezan.' };
    }
    // Osnovna email validacija
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { uspesno: false, poruka: 'Email nije ispravan.' };
    }
  }

  return { uspesno: true };
}