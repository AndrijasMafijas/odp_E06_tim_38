import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Movie } from "../types/Movie";
import type { IMovieApiService } from "../api_services/interfaces/IMovieApiService";
import { MovieApiService } from "../api_services/services/MovieApiService";
import GradeInput from "../components/forms/GradeInput";
import type { UserLoginDto } from "../models/auth/UserLoginDto";

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movieApiService: IMovieApiService = useMemo(() => new MovieApiService(), []);
  const [film, setFilm] = useState<Movie | null>(null);
  const [ucitava, setUcitava] = useState(true);

  // Proveravanje da li je korisnik ulogovan
  const korisnikStr = localStorage.getItem("korisnik");
  const korisnik: UserLoginDto | null = korisnikStr ? JSON.parse(korisnikStr) : null;

  const fetchFilm = useCallback(async () => {
    if (!id) {
      navigate("/404", { replace: true });
      return;
    }

    // Validacija da li je ID valjan broj
    const movieId = parseInt(id);
    if (isNaN(movieId) || movieId <= 0) {
      navigate("/404", { replace: true });
      return;
    }

    try {
      const film = await movieApiService.getMovieById(movieId);
      
      if (!film) {
        navigate("/404", { replace: true });
        return;
      }
      
      setFilm(film);
    } catch (err) {
      console.error("Greška pri učitavanju filma:", err);
      navigate("/404", { replace: true });
    } finally {
      setUcitava(false);
    }
  }, [id, movieApiService, navigate]);

  useEffect(() => {
    fetchFilm();
  }, [fetchFilm]);

  if (ucitava) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (!film) {
    return null; // Komponenta će biti preusmerena na 404 iz useEffect-a
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-8">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header sa osnovnim informacijama */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="md:flex">
            {/* Poster */}
            <div className="md:flex-shrink-0 md:w-1/3">
              <div className="h-96 md:h-full">
                {film.cover_image ? (
                  <img
                    src={film.cover_image}
                    alt={film.naziv}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="bg-gradient-to-br from-green-500 to-blue-600 h-full flex items-center justify-center">
                    <span className="text-white text-6xl font-bold">
                      {film.naziv.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Informacije o filmu */}
            <div className="md:flex-1 p-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {film.naziv}
                </h1>
                <button
                  onClick={() => navigate("/")}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Meta informacije */}
              <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                {film.godinaIzdanja && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {film.godinaIzdanja}
                  </span>
                )}
                {film.zanr && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h3a1 1 0 011 1v2h4a1 1 0 011 1v3a1 1 0 01-1 1h-2v4a1 1 0 01-1 1H9a1 1 0 01-1-1v-4H6a1 1 0 01-1-1V5a1 1 0 011-1h1z" />
                    </svg>
                    {film.zanr}
                  </span>
                )}
              </div>
              
              {/* Ocena */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500 text-xl">★</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {film.prosecnaOcena.toFixed(1)}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">/10</span>
                </div>
              </div>
              
              {/* Opis */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Opis
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {film.opis}
                </p>
              </div>
              
              {/* Ocenjivanje */}
              {korisnik && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Ocenite ovaj film:
                  </h3>
                  <GradeInput
                    userId={korisnik.id}
                    contentId={film.id}
                    contentType="movie"
                    onSuccess={fetchFilm}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
