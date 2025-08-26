import { useEffect, useState } from "react";
import { ucitajSerije } from "../services/serijaService";
import { type Serija } from "../types/serija";
import Trivija from "../components/Trivija";

export default function KatalogSerija() {
  const [serije, setSerije] = useState<Serija[]>([]);
  const [greska, setGreska] = useState("");
  const [ucitava, setUcitava] = useState(true);

  useEffect(() => {
    ucitajSerije()
      .then(setSerije)
      .catch(() => setGreska("Грешка при учитавању серија"))
      .finally(() => setUcitava(false));
  }, []);

  if (ucitava) return <div>Учитавање...</div>;
  if (greska) return <div style={{ color: "red" }}>{greska}</div>;

  return (
    <div>
      <h2>Каталог серија</h2>
      {serije.map((serija) => (
        <div key={serija.id} style={{ marginBottom: "2rem" }}>
          <h3>{serija.naziv}</h3>
          <p>{serija.opis}</p>
          <h4>Епизоде:</h4>
          <ul>
            {serija.epizode.map((epizoda) => (
              <li key={epizoda.id}>
                <b>{epizoda.naziv}</b>: {epizoda.opis}
                <Trivija trivija={epizoda.trivija} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}