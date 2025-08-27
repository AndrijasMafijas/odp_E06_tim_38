import { useEffect, useState } from "react";
import axios from "axios";
import GradeInput from "../components/GradeInput";
import type { UserLoginDto } from "../models/auth/UserLoginDto";

const API_URL = import.meta.env.VITE_API_URL;

interface Movie {
  id: number;
  naziv: string;
  opis: string;
  prosecnaOcena: number;
  zanr?: string;
  coverUrl?: string;
}

type SortKey = "naziv" | "prosecnaOcena";
type SortOrder = "asc" | "desc";

export default function KatalogFilmova() {
  const [filmovi, setFilmovi] = useState<Movie[]>([]);
  const [greska, setGreska] = useState("");
  const [ucitava, setUcitava] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("naziv");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [pretraga, setPretraga] = useState("");

  async function fetchFilmovi() {
    try {
      const res = await axios.get(`${API_URL}movies`);
      setFilmovi(res.data);
    } catch (err) {
      console.error("Greška pri učitavanju filmova:", err);
      setGreska("Грешка при учитавању филмова");
    } finally {
      setUcitava(false);
    }
  }

  useEffect(() => {
    fetchFilmovi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function sortiraniFilmovi() {
    let filtrirani = filmovi.filter(f =>
      f.naziv.toLowerCase().includes(pretraga.toLowerCase())
    );
    filtrirani = filtrirani.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "naziv") {
        cmp = a.naziv.localeCompare(b.naziv);
      } else {
        cmp = (a.prosecnaOcena ?? 0) - (b.prosecnaOcena ?? 0);
      }
      return sortOrder === "asc" ? cmp : -cmp;
    });
    return filtrirani;
  }

  if (ucitava) return <div className="p-4 text-center text-gray-600 dark:text-gray-300">Учитавање...</div>;
  if (greska) return <div className="p-4 text-center text-red-600 dark:text-red-400">{greska}</div>;

  // Prijavljeni korisnik iz localStorage
  let korisnik: UserLoginDto | null = null;
  try {
    const korisnikStr = localStorage.getItem("korisnik");
    if (korisnikStr) korisnik = JSON.parse(korisnikStr);
  } catch {
    // Ignore errors
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Каталог филмова</h2>
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <input
          type="text"
          placeholder="Претрaga по називу..."
          className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={pretraga}
          onChange={e => setPretraga(e.target.value)}
        />
        <label className="text-gray-700 dark:text-gray-200">Сортирај по:</label>
        <select 
          value={sortKey} 
          onChange={e => setSortKey(e.target.value as SortKey)} 
          className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="naziv">Називу</option>
          <option value="prosecnaOcena">Просечној оцени</option>
        </select>
        <select 
          value={sortOrder} 
          onChange={e => setSortOrder(e.target.value as SortOrder)} 
          className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="asc">Растуће</option>
          <option value="desc">Опадајуће</option>
        </select>
      </div>
      <div className="flex flex-wrap gap-4">
        {sortiraniFilmovi().map((film) => (
          <div
            key={film.id}
            className="border border-gray-200 dark:border-gray-700 rounded p-4 w-64 bg-white dark:bg-gray-800 shadow"
          >
            {film.coverUrl && (
              <img src={film.coverUrl} alt={film.naziv} className="mb-2 w-full h-40 object-cover rounded" />
            )}
            <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">{film.naziv}</h3>
            <p className="text-sm mb-2 text-gray-700 dark:text-gray-300">{film.opis}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Жанр: {film.zanr ?? "-"}</p>
            <p className="font-bold text-gray-900 dark:text-white">Просечна оцена: {film.prosecnaOcena?.toFixed(2) ?? "N/A"}</p>
            {korisnik && (
              <GradeInput
                userId={korisnik.id}
                contentId={film.id}
                contentType="movie"
                onSuccess={fetchFilmovi}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
