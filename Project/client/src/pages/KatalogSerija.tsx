/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useMemo } from "react";
import type { Trivia } from "../types/Trivia";
import type { ITriviaApiService } from "../api_services/interfaces/ITriviaApiService";
import type { ISeriesApiService } from "../api_services/interfaces/ISeriesApiService";
import { TriviaApiService } from "../api_services/services/TriviaApiService";
import { SeriesApiService } from "../api_services/services/SeriesApiService";
import axios from "axios";
import GradeInput from "../components/forms/GradeInput";
import AddSeriesForm from "../components/forms/AddSeriesForm";
import DeleteConfirmModal from "../components/modals/DeleteConfirmModal";
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
  cover_image?: string;
}

type SortKey = "naziv" | "prosecnaOcena";
type SortOrder = "asc" | "desc";

export default function KatalogSerija() {
  const [serije, setSerije] = useState<Series[]>([]);
  const [trivije, setTrivije] = useState<Record<number, Trivia[]>>({});
  const [greska, setGreska] = useState("");
  const [ucitava, setUcitava] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("naziv");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [pretraga, setPretraga] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [seriesToDelete, setSeriesToDelete] = useState<Series | null>(null);
  const navigate = useNavigate();

  // Direktno instanciranje servisa sa useMemo i interface tipovima
  const triviaService: ITriviaApiService = useMemo(() => new TriviaApiService(), []);
  const seriesService: ISeriesApiService = useMemo(() => new SeriesApiService(), []);

  async function fetchSerije() {
    try {
      const res = await axios.get(`${API_URL}series`);
      
      // Mapiranje backend podataka na frontend format
      const mapiraneSerije = res.data.map((serija: any) => {
        return {
          id: serija.id,
          naziv: serija.naziv,
          opis: serija.opis,
          prosecnaOcena: serija.prosecnaOcena,
          brojSezona: serija.brojEpizoda, // Backend ima brojEpizoda, frontend očekuje brojSezona
          zanr: serija.zanr,
          godinaIzdanja: serija.godinaIzdanja,
          cover_image: serija.coverUrl || serija.cover_image // Backend šalje coverUrl, frontend koristi cover_image
        };
      });
      
      setSerije(mapiraneSerije);
    } catch (err) {
      console.error("Greška pri učitavanju serija:", err);
      setGreska("Greška pri učitavanju serija");
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
            const data = await triviaService.getTriviasByContent(serija.id, "series");
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

  const handleDeleteSeries = async (series: Series) => {
    try {
      const result = await seriesService.deleteSeries(series.id);
      if (result.success) {
        setSerije(prev => prev.filter(s => s.id !== series.id));
        setTrivije(prev => {
          const { [series.id]: deleted, ...rest } = prev;
          return rest;
        });
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Greška pri brisanju serije:", error);
      alert("Greška pri uklanjanju serije.");
    }
  };

  const openDeleteModal = (series: Series) => {
    setSeriesToDelete(series);
    setShowDeleteModal(true);
  };

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

  if (ucitava) return <div className="p-4 text-center text-gray-600 dark:text-gray-300">Učitavanje...</div>;
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Katalog serija</h2>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <input
          type="text"
          placeholder="Pretraga po nazivu..."
          className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={pretraga}
          onChange={e => setPretraga(e.target.value)}
        />
        <label className="text-gray-700 dark:text-gray-200">Sortiraj po:</label>
        <select 
          value={sortKey} 
          onChange={e => setSortKey(e.target.value as SortKey)} 
          className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="naziv">Nazivu</option>
          <option value="prosecnaOcena">Prosečnoj oceni</option>
        </select>
        <select 
          value={sortOrder} 
          onChange={e => setSortOrder(e.target.value as SortOrder)} 
          className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="asc">Rastuće</option>
          <option value="desc">Opadajuće</option>
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
              Dodaj novu seriju
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 text-center">
              Klikni da dodaš seriju
            </p>
          </div>
        )}
        
        {/* Series Cards */}
        {sortiraneSerije().map((serija) => {
          return (
          <div
            key={serija.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow cursor-pointer hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between"
            onClick={() => handleSerijaClick(serija.id)}
          >
            {serija.cover_image && (
              <img 
                src={serija.cover_image} 
                alt={serija.naziv} 
                className="mb-3 w-full h-48 object-cover rounded-md"
              />
            )}
            {!serija.cover_image && (
              <div className="mb-3 w-full h-48 bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">No Image</span>
              </div>
            )}
            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white line-clamp-1">{serija.naziv}</h3>
            <p className="text-sm mb-3 text-gray-700 dark:text-gray-300 line-clamp-2">{serija.opis}</p>
            <div className="space-y-1 mb-3">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <span className="font-medium">Žanr:</span> {serija.zanr ?? "-"}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <span className="font-medium">Sezone:</span> {serija.brojSezona} | <span className="font-medium">Godina:</span> {serija.godinaIzdanja}
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
                <div className="space-y-2 w-full">
                  {korisnik && (
                    <GradeInput
                      userId={korisnik.id}
                      contentId={serija.id}
                      contentType="series"
                      onSuccess={fetchSerije}
                    />
                  )}
                  {korisnik && korisnik.uloga === 'admin' && (
                    <button
                      onClick={() => openDeleteModal(serija)}
                      className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-1"
                    >
                      🗑️ Ukloni seriju
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
        })}
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

      {/* Delete Series Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => seriesToDelete && handleDeleteSeries(seriesToDelete)}
        itemName={seriesToDelete?.naziv || ""}
        itemType="serija"
      />
    </div>
  );
}
