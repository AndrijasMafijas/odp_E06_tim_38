import { useEffect, useState } from "react";
import { triviaApi } from "../api_services/TriviaAPIService";
import type { TriviaDto } from "../models/TriviaDto";
import axios from "axios";
import GradeInput from "../components/GradeInput";
import AddMovieForm from "../components/AddMovieForm";
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
  const [trivije, setTrivije] = useState<Record<number, TriviaDto[]>>({});
  const [greska, setGreska] = useState("");
  const [ucitava, setUcitava] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("naziv");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [pretraga, setPretraga] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

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
  }, []);

  useEffect(() => {
    // Kada se filmovi učitaju, povuci trivije za svaki film
    if (filmovi.length > 0) {
      filmovi.forEach(async (film) => {
        if (!trivije[film.id]) {
          try {
            const data = await triviaApi.getByContent(film.id, "movie");
            setTrivije(prev => ({ ...prev, [film.id]: data }));
          } catch (error) {
            // Ignore trivia loading errors
            console.warn(`Failed to load trivia for movie ${film.id}:`, error);
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filmovi]);

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Add Movie Card - samo za admin korisnike */}
        {korisnik && korisnik.uloga === 'admin' && (
          <div
            onClick={() => setShowAddForm(true)}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 cursor-pointer group flex flex-col items-center justify-center min-h-[400px]"
          >
            <div className="text-6xl text-gray-400 dark:text-gray-500 group-hover:text-green-500 transition-colors duration-200 mb-4">
              +
            </div>
            <h3 className="font-semibold text-lg text-gray-600 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200 text-center">
              Додај нови филм
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 text-center">
              Кликни да додаш филм
            </p>
          </div>
        )}
        
        {/* Movie Cards */}
        {sortiraniFilmovi().map((film) => (
          <div
            key={film.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between"
          >
            {film.coverUrl && (
              <img src={film.coverUrl} alt={film.naziv} className="mb-3 w-full h-48 object-cover rounded-md" />
            )}
            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white line-clamp-1">{film.naziv}</h3>
            <p className="text-sm mb-3 text-gray-700 dark:text-gray-300 line-clamp-2">{film.opis}</p>
            <div className="space-y-1 mb-3">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <span className="font-medium">Жанр:</span> {film.zanr ?? "-"}
              </p>
              {trivije[film.id] && trivije[film.id][0] && (
                <p className="text-xs text-blue-700 dark:text-blue-300 line-clamp-1" title={trivije[film.id][0].pitanje}>
                  <span className="font-medium">Trivia:</span> {trivije[film.id][0].pitanje}
                </p>
              )}
            </div>
            {/* Ocena i dugme u posebnom boxu */}
            <div className="mt-auto">
              <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-2 flex flex-col items-center">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-sm text-gray-700 dark:text-gray-300 mr-1">Prosečna ocena:</span>
                  <span className="text-yellow-500 text-lg">⭐</span>
                  <span className="text-base font-semibold text-gray-900 dark:text-white">{film.prosecnaOcena?.toFixed(1) ?? "N/A"}</span>
                </div>
                {korisnik && (
                  <GradeInput
                    userId={korisnik.id}
                    contentId={film.id}
                    contentType="movie"
                    onSuccess={fetchFilmovi}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Movie Modal */}
      {showAddForm && (
        <AddMovieForm
          onSuccess={() => {
            setShowAddForm(false);
            fetchFilmovi();
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}
