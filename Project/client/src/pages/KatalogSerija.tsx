import { useEffect, useState } from "react";
import axios from "axios";
import GradeInput from "../components/GradeInput";
import type { UserLoginDto } from "../models/auth/UserLoginDto";

interface Series {
  id: number;
  naziv: string;
  opis: string;
  prosecnaOcena: number;
  zanr?: string;
  coverUrl?: string;
}

type SortKey = "naziv" | "prosecnaOcena";
type SortOrder = "asc" | "desc";

export default function KatalogSerija() {
  const [serije, setSerije] = useState<Series[]>([]);
  const [greska, setGreska] = useState("");
  const [ucitava, setUcitava] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("naziv");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [pretraga, setPretraga] = useState("");

  async function fetchSerije() {
    try {
      const res = await axios.get("/api/series");
      setSerije(res.data);
    } catch (err) {
      setGreska("Грешка при учитавању серија");
    } finally {
      setUcitava(false);
    }
  }

  useEffect(() => {
    fetchSerije();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function sortiraneSerije() {
    let filtrirane = serije.filter(s =>
      s.naziv.toLowerCase().includes(pretraga.toLowerCase())
    );
    filtrirane = filtrirane.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "naziv") {
        cmp = a.naziv.localeCompare(b.naziv);
      } else {
        cmp = (a.prosecnaOcena ?? 0) - (b.prosecnaOcena ?? 0);
      }
      return sortOrder === "asc" ? cmp : -cmp;
    });
    return filtrirane;
  }

  if (ucitava) return <div>Учитавање...</div>;
  if (greska) return <div style={{ color: "red" }}>{greska}</div>;

  // Prijavljeni korisnik iz localStorage
  let korisnik: UserLoginDto | null = null;
  try {
    const korisnikStr = localStorage.getItem("korisnik");
    if (korisnikStr) korisnik = JSON.parse(korisnikStr);
  } catch {}

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Каталог серија</h2>
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <input
          type="text"
          placeholder="Претрага по називу..."
          className="border rounded px-2 py-1"
          value={pretraga}
          onChange={e => setPretraga(e.target.value)}
        />
        <label>Сортирај по:</label>
        <select value={sortKey} onChange={e => setSortKey(e.target.value as SortKey)} className="border rounded px-2 py-1">
          <option value="naziv">Називу</option>
          <option value="prosecnaOcena">Просечној оцени</option>
        </select>
        <select value={sortOrder} onChange={e => setSortOrder(e.target.value as SortOrder)} className="border rounded px-2 py-1">
          <option value="asc">Растуће</option>
          <option value="desc">Опадајуће</option>
        </select>
      </div>
      <div className="flex flex-wrap gap-4">
        {sortiraneSerije().map((serija) => (
          <div
            key={serija.id}
            className="border rounded p-4 w-64 bg-white shadow"
          >
            {serija.coverUrl && (
              <img src={serija.coverUrl} alt={serija.naziv} className="mb-2 w-full h-40 object-cover rounded" />
            )}
            <h3 className="font-semibold text-lg mb-1">{serija.naziv}</h3>
            <p className="text-sm mb-2">{serija.opis}</p>
            <p className="text-xs text-gray-600 mb-1">Жанр: {serija.zanr ?? "-"}</p>
            <p className="font-bold">Просечна оцена: {serija.prosecnaOcena?.toFixed(2) ?? "N/A"}</p>
            {korisnik && (
              <GradeInput
                userId={korisnik.id}
                contentId={serija.id}
                contentType="series"
                onSuccess={fetchSerije}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
