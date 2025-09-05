import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import GradeInput from "../components/forms/GradeInput";
import type { UserLoginDto } from "../models/auth/UserLoginDto";

const API_URL = import.meta.env.VITE_API_URL;

interface Series {
  id: number;
  naziv: string;
  opis: string;
  prosecnaOcena: number;
  brojSezona: number;
  zanr?: string;
  godinaIzdanja?: number;
  coverImage?: string;
}

interface Episode {
  id: number;
  seriesId: number;
  nazivEpizode: string;
  opisEpizode: string;
  brojEpizode: number;
  brojSezone: number;
  urlSlike?: string;
}

export default function SerieDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [serija, setSerija] = useState<Series | null>(null);
  const [epizode, setEpizode] = useState<Episode[]>([]);
  const [odabranaSezone, setOdabranaSezone] = useState(1);
  const [greska, setGreska] = useState("");
  const [ucitava, setUcitava] = useState(true);

  const fetchSerija = async () => {
    if (!id) return;
    try {
      const res = await axios.get(`${API_URL}series/${id}`);
      setSerija(res.data);
    } catch (err) {
      console.error("Greška pri učitavanju serije:", err);
    }
  };

  const fetchEpizode = async (seasonNumber: number = 1) => {
    if (!id) return;
    try {
      // Generiši placeholder epizode pošto nema API endpoint
      const placeholderEpizode: Episode[] = [];
      for (let i = 1; i <= 10; i++) {
        placeholderEpizode.push({
          id: i,
          seriesId: parseInt(id),
          nazivEpizode: `Epizoda ${i}`,
          opisEpizode: `Opis epizode ${i} sezone ${seasonNumber}`,
          brojEpizode: i,
          brojSezone: seasonNumber,
          urlSlike: undefined
        });
      }
      setEpizode(placeholderEpizode);
    } catch (err) {
      console.error("Greška pri učitavanju epizoda:", err);
    }
  };

  useEffect(() => {
    async function loadSerija() {
      if (!id) {
        setGreska("Nevazeći ID serije");
        setUcitava(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}series/${id}`);
        setSerija(res.data);
        
        // Učitaj epizode za prvu sezonu
        await fetchEpizode(1);
      } catch (err) {
        console.error("Greška pri učitavanju serije:", err);
        setGreska("Serija nije pronađena");
      } finally {
        setUcitava(false);
      }
    }

    loadSerija();
  }, [id]);

  const handleSeasonChange = async (seasonNumber: number) => {
    setOdabranaSezone(seasonNumber);
    await fetchEpizode(seasonNumber);
  };

  if (ucitava) {
    return (
      <div className="p-4 text-center text-gray-600 dark:text-gray-300">
        Učitavanje...
      </div>
    );
  }

  if (greska) {
    return (
      <div className="p-4">
        <div className="text-center text-red-600 dark:text-red-400 mb-4">{greska}</div>
        <button
          onClick={() => navigate("/serije")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Nazad na katalog serija
        </button>
      </div>
    );
  }

  if (!serija) {
    return (
      <div className="p-4 text-center text-red-600 dark:text-red-400">
        Serija nije pronađena
      </div>
    );
  }

  // Prijavljeni korisnik iz localStorage
  let korisnik: UserLoginDto | null = null;
  try {
    const korisnikStr = localStorage.getItem("korisnik");
    if (korisnikStr) korisnik = JSON.parse(korisnikStr);
  } catch {
    // Ignore errors
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/serije")}
        className="mb-4 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded inline-flex items-center"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Nazad
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {serija.coverImage && (
            <div className="md:w-1/3">
              <img 
                src={serija.coverImage} 
                alt={serija.naziv} 
                className="w-full h-96 md:h-full object-cover" 
              />
            </div>
          )}
          
          <div className="md:w-2/3 p-6">
            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              {serija.naziv}
            </h1>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Žanr:</span>
                <p className="text-gray-900 dark:text-white">{serija.zanr ?? "Nepoznat"}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Broj sezona:</span>
                <p className="text-gray-900 dark:text-white">{serija.brojSezona}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Godina izdanja:</span>
                <p className="text-gray-900 dark:text-white">{serija.godinaIzdanja ?? "Nepoznato"}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Prosečna ocena:</span>
                <p className="text-gray-900 dark:text-white text-lg font-bold">
                  {serija.prosecnaOcena?.toFixed(2) ?? "N/A"} / 10
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <span className="font-semibold text-gray-700 dark:text-gray-300 text-lg">Opis:</span>
              <p className="text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
                {serija.opis}
              </p>
            </div>

            {korisnik && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Ocenite ovu seriju:
                </h3>
                <GradeInput
                  userId={korisnik.id}
                  contentId={serija.id}
                  contentType="series"
                  onSuccess={fetchSerija}
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Sekcija za epizode */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mt-6 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Epizode
            </h2>
            
            {/* Selektor sezone */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Sezona:</span>
              <select
                value={odabranaSezone}
                onChange={(e) => handleSeasonChange(parseInt(e.target.value))}
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: serija.brojSezona }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Sezona {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Grid epizoda */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {epizode.map((epizoda) => (
              <div
                key={epizoda.id}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Placeholder slika epizode */}
                <div className="w-full h-32 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
                  {epizoda.urlSlike ? (
                    <img
                      src={epizoda.urlSlike}
                      alt={`Epizoda ${epizoda.brojEpizode}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <svg className="w-8 h-8 mx-auto text-gray-500 dark:text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Epizoda {epizoda.brojEpizode}</span>
                    </div>
                  )}
                </div>
                
                {/* Informacije o epizodi */}
                <div className="p-3">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                    {epizoda.nazivEpizode}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                    {epizoda.opisEpizode}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {epizode.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Nema dostupnih epizoda za ovu sezonu.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
