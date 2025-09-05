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
  coverUrl?: string;
}

export default function SerieDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [serija, setSerija] = useState<Series | null>(null);
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
      } catch (err) {
        console.error("Greška pri učitavanju serije:", err);
        setGreska("Serija nije pronađena");
      } finally {
        setUcitava(false);
      }
    }

    loadSerija();
  }, [id]);

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
          {serija.coverUrl && (
            <div className="md:w-1/3">
              <img 
                src={serija.coverUrl} 
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
      </div>
    </div>
  );
}
