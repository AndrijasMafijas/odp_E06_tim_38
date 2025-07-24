import { useState } from "react";
import { SačuvajVrednostPoKljuču } from "../../helpers/local_storage";
import type { AuthFormProps } from "../../types/props/auth_form_props/AuthFormProps";
import { validacijaPodatakaAuth } from "../../api_services/validators/auth/AuthValidator";

export default function AutentifikacionaForma({
  authApi,
  onLoginSuccess,
}: AuthFormProps) {
  const [korisnickoIme, setKorisnickoIme] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [greska, setGreska] = useState("");
  const [jeRegistracija, setJeRegistracija] = useState(false);

  const podnesiFormu = async (e: React.FormEvent) => {
    e.preventDefault();

    const validacija = validacijaPodatakaAuth(korisnickoIme, lozinka);
    if (!validacija.uspesno) {
      setGreska(validacija.poruka ?? "Неисправни подаци");
      return;
    }

    const odgovor = jeRegistracija
      ? await authApi.registracija(korisnickoIme, lozinka)
      : await authApi.prijava(korisnickoIme, lozinka);

    if (odgovor.success && odgovor.data) {
      const token = `${odgovor.data.korisnickoIme}/${odgovor.data.id}`;
      SačuvajVrednostPoKljuču("authToken", token);
      onLoginSuccess();
    } else {
      setGreska(odgovor.message);
      setKorisnickoIme("");
      setLozinka("");
    }
  };

  return (
    <div className="form-container">
      <h1>{jeRegistracija ? "Регистрација" : "Пријава"}</h1>
      <form onSubmit={podnesiFormu}>
        <div className="input-group">
          <label htmlFor="username">Корисничко име:</label>
          <input
            id="username"
            type="text"
            value={korisnickoIme}
            onChange={(e) => setKorisnickoIme(e.target.value)}
            placeholder="Унесите корисничко име"
            minLength={3}
            maxLength={20}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Лозинка:</label>
          <input
            id="password"
            type="password"
            value={lozinka}
            onChange={(e) => setLozinka(e.target.value)}
            placeholder="Унесите лозинку"
            minLength={6}
            maxLength={20}
            required
          />
        </div>

        {greska && <p style={{ color: "red" }}>{greska}</p>}

        <button type="submit">
          {jeRegistracija ? "Регистрација" : "Пријава"}
        </button>
      </form>
      <button
        onClick={() => setJeRegistracija(!jeRegistracija)}
        style={{ marginTop: "1rem" }}
      >
        {jeRegistracija
          ? "Имате налог? Пријавите се"
          : "Немате налог? Региструјте се"}
      </button>
    </div>
  );
}
