import { useEffect, useState } from "react";
import axios from "axios";

interface Movie {
  id: number;
  naziv: string;
  opis: string;
  prosecnaOcena: number;
}

export default function KatalogFilmova() {
  const [filmovi, setFilmovi] = useState<Movie[]>([]);
  const [greska, setGreska] = useState("");
  const [ucitava, setUcitava] = useState(true);

  useEffect(() => {
    async function fetchFilmovi() {
      try {
        const res = await axios.get("/api/movies");
        setFilmovi(res.data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setGreska("Грешка при учитавању филмова");
      } finally {
        setUcitava(false);
      }
    }
    fetchFilmovi();
  }, []);

  if (ucitava) return <div>Учитавање...</div>;
  if (greska) return <div style={{ color: "red" }}>{greska}</div>;

  return (
    <div>
      <h2>Каталог филмова</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {filmovi.map((film) => (
          <div
            key={film.id}
            style={{ border: "1px solid #ccc", padding: "1rem", width: 250 }}
          >
            <h3>{film.naziv}</h3>
            <p>{film.opis}</p>
            <p>Просечна оцена: {film.prosecnaOcena?.toFixed(2) ?? "N/A"}</p>
            {/* Ovde može dugme za detalje */}
          </div>
        ))}
      </div>
    </div>
  );
}
