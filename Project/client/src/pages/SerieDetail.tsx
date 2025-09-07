import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Series } from "../types/Series";
import type { IEpisodeApiService } from "../api_services/interfaces/IEpisodeApiService";
import type { ISeriesApiService } from "../api_services/interfaces/ISeriesApiService";
import { EpisodeApiService } from "../api_services/services/EpisodeApiService";
import { SeriesApiService } from "../api_services/services/SeriesApiService";
import GradeInput from "../components/forms/GradeInput";
import AddEpisodeForm from "../components/forms/AddEpisodeForm";
import ConfirmDeleteModal from "../components/modals/ConfirmDeleteModal";
import type { UserLoginDto } from "../models/auth/UserLoginDto";
import type { Episode } from "../types/Episode";

export default function SerieDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const episodeApiService: IEpisodeApiService = useMemo(() => new EpisodeApiService(), []);
  const seriesApiService: ISeriesApiService = useMemo(() => new SeriesApiService(), []);
  const [serija, setSerija] = useState<Series | null>(null);
  const [epizode, setEpizode] = useState<Episode[]>([]);
  const [ucitava, setUcitava] = useState(true);
  const [ucitavaEpizode, setUcitavaEpizode] = useState(false);
  const [showAddEpisodeForm, setShowAddEpisodeForm] = useState(false);
  
  // State za modal brisanja
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [episodeToDelete, setEpisodeToDelete] = useState<Episode | null>(null);

  const fetchSerija = useCallback(async () => {
    if (!id) {
      navigate("/404", { replace: true });
      return;
    }

    // Validacija da li je ID valjan broj
    const seriesId = parseInt(id);
    if (isNaN(seriesId) || seriesId <= 0) {
      navigate("/404", { replace: true });
      return;
    }

    try {
      const serija = await seriesApiService.getSeriesById(seriesId);
      if (!serija) {
        navigate("/404", { replace: true });
        return;
      }
      setSerija(serija);
    } catch (err) {
      console.error("Greška pri učitavanju serije:", err);
      navigate("/404", { replace: true });
    }
  }, [id, seriesApiService, navigate]);

  const fetchEpizode = useCallback(async () => {
    if (!id) return;
    
    // Validacija da li je ID valjan broj
    const seriesId = parseInt(id);
    if (isNaN(seriesId) || seriesId <= 0) {
      return;
    }

    setUcitavaEpizode(true);
    try {
      const episodes = await episodeApiService.getEpisodesBySeriesId(seriesId);
      setEpizode(episodes);
    } catch (err) {
      console.error("Greška pri učitavanju epizoda:", err);
      setEpizode([]);
    } finally {
      setUcitavaEpizode(false);
    }
  }, [id, episodeApiService]);

  useEffect(() => {
    async function loadData() {
      await fetchSerija();
      await fetchEpizode();
      setUcitava(false);
    }
    
    loadData();
  }, [fetchSerija, fetchEpizode]);

  // Funkcija za brisanje epizode
  const handleDeleteEpisode = (epizoda: Episode) => {
    setEpisodeToDelete(epizoda);
    setShowDeleteModal(true);
  };

  // Potvrda brisanja epizode
  const confirmDeleteEpisode = async () => {
    if (!episodeToDelete) return;

    try {
      await episodeApiService.delete(episodeToDelete.id);
      
      // Ukloni epizodu iz lokalnog stanja
      setEpizode(prevEpizode => prevEpizode.filter(e => e.id !== episodeToDelete.id));
      
      // Zatvori modal
      setShowDeleteModal(false);
      setEpisodeToDelete(null);
      
      // Prikaži poruku o uspešnom brisanju
      alert('Epizoda je uspešno obrisana!');
    } catch (error) {
      console.error('Greška pri brisanju epizode:', error);
      alert('Greška pri brisanju epizode. Molimo pokušajte ponovo.');
    }
  };

  // Otkaži brisanje
  const cancelDeleteEpisode = () => {
    setShowDeleteModal(false);
    setEpisodeToDelete(null);
  };

  const handleAddEpisodeSuccess = async () => {
    // Osvežavanje epizoda kada se uspešno doda nova epizoda
    await fetchEpizode();
  };

  if (ucitava) {
    return (
      <div className="p-4 text-center text-gray-600 dark:text-gray-300">
        Učitavanje...
      </div>
    );
  }

  if (!serija) {
    return null; // Komponenta će biti preusmerena na 404 iz fetchSerija funkcije
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
          
          {!serija.coverImage && (
            <div className="md:w-1/3 bg-gray-200 dark:bg-gray-600 flex items-center justify-center h-96">
              <span className="text-gray-500 dark:text-gray-400">No Series Image</span>
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
                <span className="font-semibold text-gray-700 dark:text-gray-300">Broj epizoda:</span>
                <p className="text-gray-900 dark:text-white">{serija.brojEpizoda}</p>
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
          </div>
          
          {/* Loading indicator za epizode */}
          {ucitavaEpizode ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">Učitavanje epizoda...</span>
            </div>
          ) : (
            <>
              {/* Grid epizoda */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Kartica za dodavanje nove epizode - samo za administratore */}
                {korisnik && korisnik.uloga === 'admin' && (
                  <div
                    onClick={() => setShowAddEpisodeForm(true)}
                    className="bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-400 cursor-pointer group"
                  >
                    <div className="relative w-full h-48 bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <div className="text-center text-white group-hover:scale-110 transition-transform duration-200">
                        <svg className="w-16 h-16 mx-auto mb-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-lg font-bold">Dodaj epizodu</span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 text-center">
                        Nova epizoda
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                        Kliknite da dodate novu epizodu u ovu seriju
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Postojeće epizode */}
                {epizode.map((epizoda) => (
              <div
                key={epizoda.id}
                className="bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-200 dark:border-gray-600"
              >
                {/* Slika epizode */}
                <div className="relative w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  {epizoda.cover_image ? (
                    <img
                      src={epizoda.cover_image}
                      alt={`Epizoda ${epizoda.brojEpizode}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-white">
                      <svg className="w-12 h-12 mx-auto mb-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium">Epizoda {epizoda.brojEpizode}</span>
                    </div>
                  )}
                  
                  {/* Badge sa brojem epizode */}
                  <div className="absolute top-2 right-2">
                    <span className="bg-black bg-opacity-75 text-white text-xs font-bold px-2 py-1 rounded-full">
                      #{epizoda.brojEpizode}
                    </span>
                  </div>
                </div>
                
                {/* Informacije o epizodi */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1">
                    {epizoda.naziv}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-3 leading-relaxed">
                    {epizoda.opis}
                  </p>
                  
                  {/* Metrika */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {epizoda.trajanje} min
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {epizoda.prosecnaOcena.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Dugme za brisanje - samo za administratore */}
                  {korisnik && korisnik.uloga === 'admin' && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Sprečava da se klik propagira na kartu
                          handleDeleteEpisode(epizoda);
                        }}
                        className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Ukloni epizodu
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {epizode.length === 0 && !ucitavaEpizode && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Nema dostupnih epizoda za ovu seriju.
            </div>
          )}
            </>
          )}
        </div>
      </div>
      
      {/* Modal za dodavanje epizode */}
      {showAddEpisodeForm && serija && (
        <AddEpisodeForm
          seriesId={serija.id}
          onClose={() => setShowAddEpisodeForm(false)}
          onSuccess={handleAddEpisodeSuccess}
        />
      )}
      
      {/* Modal za potvrdu brisanja */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={cancelDeleteEpisode}
        onConfirm={confirmDeleteEpisode}
        title="Potvrda brisanja"
        message="Da li ste sigurni da želite da obrišete ovu epizodu?"
        itemName={episodeToDelete?.naziv}
      />
    </div>
  );
}
