import { useEffect, useState } from "react";
import { triviaApi } from "../api_services/TriviaAPIService";
import type { TriviaDto } from "../models/TriviaDto";
import axios from "axios";
import GradeInput from "../components/GradeInput";
import AddSeriesForm from "../components/AddSeriesForm";
import type { UserLoginDto } from "../models/auth/UserLoginDto";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

interface Series {
  id: number;
  naziv: string;
  opis: string;
  prosecnaOcena: number;
  brojSezona: number;
  zanr?: string;
  godinaIzdanja?: number;
  coverUrl?: string;
}

type SortKey = "naziv" | "prosecnaOcena";
type SortOrder = "asc" | "desc";

export default function KatalogSerija() {
  const [serije, setSerije] = useState<Series[]>([]);
  const [trivije, setTrivije] = useState<Record<number, TriviaDto[]>>({});
  const [greska, setGreska] = useState("");
  const [ucitava, setUcitava] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("naziv");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [pretraga, setPretraga] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  async function fetchSerije() {
    try {
      const res = await axios.get(`${API_URL}series`);
      setSerije(res.data);
    } catch (err) {
      console.error("Greška pri učitavanju serija:", err);
      setGreska("Грешка при учитавању серија");
    } finally {
      setUcitava(false);
    }
  }

  useEffect(() => {
    fetchSerije();
  }, []);

  useEffect(() => {
    // Kada se serije učitaju, povuci trivije za svaku seriju
    if (serije.length > 0) {
      serije.forEach(async (serija) => {
        if (!trivije[serija.id]) {
          try {
            const data = await triviaApi.getByContent(serija.id, "series");
            setTrivije(prev => ({ ...prev, [serija.id]: data }));
          } catch (error) {
            // Ignore trivia loading errors
            console.warn(`Failed to load trivia for series ${serija.id}:`, error);
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serije]);

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

  const handleSerijaClick = (serijaId: number) => {
    navigate(`/serije/${serijaId}`);
  };

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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Каталог серија</h2>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <input
          type="text"
          placeholder="Претрага по називу..."
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
        {/* Add Series Card - samo za admin korisnike */}
        {korisnik && korisnik.uloga === 'admin' && (
          <div
            onClick={() => setShowAddForm(true)}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 cursor-pointer group flex flex-col items-center justify-center min-h-[400px]"
          >
            <div className="text-6xl text-gray-400 dark:text-gray-500 group-hover:text-green-500 transition-colors duration-200 mb-4">
              +
            </div>
            <h3 className="font-semibold text-lg text-gray-600 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200 text-center">
              Додај нову серију
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 text-center">
              Кликни да додаш серију
            </p>
          </div>
        )}
        
        {/* Series Cards */}
        {sortiraneSerije().map((serija) => (
          <div
            key={serija.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow cursor-pointer hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between"
            onClick={() => handleSerijaClick(serija.id)}
          >
            {serija.coverUrl && (
              <img src={serija.coverUrl} alt={serija.naziv} className="mb-3 w-full h-48 object-cover rounded-md" />
            )}
            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white line-clamp-1">{serija.naziv}</h3>
            <p className="text-sm mb-3 text-gray-700 dark:text-gray-300 line-clamp-2">{serija.opis}</p>
            <div className="space-y-1 mb-3">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <span className="font-medium">Жанр:</span> {serija.zanr ?? "-"}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <span className="font-medium">Сезоне:</span> {serija.brojSezona} | <span className="font-medium">Година:</span> {serija.godinaIzdanja}
              </p>
              {trivije[serija.id] && trivije[serija.id][0] && (
                <p className="text-xs text-blue-700 dark:text-blue-300 line-clamp-1" title={trivije[serija.id][0].pitanje}>
                  <span className="font-medium">Trivia:</span> {trivije[serija.id][0].pitanje}
                </p>
              )}
            </div>
            {/* Ocena i dugme u posebnom boxu */}
            <div className="mt-auto" onClick={e => e.stopPropagation()}>
              <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-2 flex flex-col items-center">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-sm text-gray-700 dark:text-gray-300 mr-1">Prosečna ocena:</span>
                  <span className="text-yellow-500 text-lg">⭐</span>
                  <span className="text-base font-semibold text-gray-900 dark:text-white">{serija.prosecnaOcena?.toFixed(1) ?? "N/A"}</span>
                </div>
                {korisnik && (
                  <GradeInput
                    userId={korisnik.id}
                    contentId={serija.id}
                    contentType="series"
                    onSuccess={fetchSerije}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Series Modal */}
      {showAddForm && (
        <AddSeriesForm
          onSuccess={() => {
            setShowAddForm(false);
            fetchSerije();
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}
