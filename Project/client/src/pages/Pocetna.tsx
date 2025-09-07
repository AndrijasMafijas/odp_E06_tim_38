import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import type { Movie } from "../types/Movie";
import type { Series } from "../types/Series";
import type { IMovieApiService } from "../api_services/interfaces/IMovieApiService";
import type { ISeriesApiService } from "../api_services/interfaces/ISeriesApiService";
import { MovieApiService } from "../api_services/services/MovieApiService";
import { SeriesApiService } from "../api_services/services/SeriesApiService";

export default function Pocetna() {
  const movieApiService: IMovieApiService = useMemo(() => new MovieApiService(), []);
  const seriesApiService: ISeriesApiService = useMemo(() => new SeriesApiService(), []);
  
  const [topFilmovi, setTopFilmovi] = useState<Movie[]>([]);
  const [topSerije, setTopSerije] = useState<Series[]>([]);
  const [sviFilmovi, setSviFilmovi] = useState<Movie[]>([]);
  const [sveSerije, setSveSerije] = useState<Series[]>([]);
  const [ucitava, setUcitava] = useState(true);
  const [pretraga, setPretraga] = useState("");
  const [rezultatiPretrage, setRezultatiPretrage] = useState<(Movie | Series)[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Učitaj filmove i serije sa service layer
        const [filmovi, serije] = await Promise.all([
          movieApiService.getAllMovies(),
          seriesApiService.getAllSeries()
        ]);

        // Podaci su već pravilno formatirani iz servisa
        const mapiraneSerije = serije;

        // Podaci su već pravilno formatirani iz servisa
        const mapiraniFilmovi = filmovi;

        // Sortiraj po prosečnoj oceni i uzmi top 3
        const sortedFilmovi = mapiraniFilmovi
          .sort((a: Movie, b: Movie) => b.prosecnaOcena - a.prosecnaOcena)
          .slice(0, 3);
        
        const sortedSerije = mapiraneSerije
          .sort((a: Series, b: Series) => b.prosecnaOcena - a.prosecnaOcena)
          .slice(0, 3);

        setTopFilmovi(sortedFilmovi);
        setTopSerije(sortedSerije);
        setSviFilmovi(mapiraniFilmovi);
        setSveSerije(mapiraneSerije);
      } catch (error) {
        console.error("Greška pri učitavanju podataka:", error);
      } finally {
        setUcitava(false);
      }
    };

    fetchData();
  }, [movieApiService, seriesApiService]);

  useEffect(() => {
    if (pretraga.trim() === "") {
      setRezultatiPretrage([]);
      return;
    }

    const filtrirani = [
      ...sviFilmovi.filter(film => 
        film.naziv.toLowerCase().includes(pretraga.toLowerCase())
      ),
      ...sveSerije.filter(serija => 
        serija.naziv.toLowerCase().includes(pretraga.toLowerCase())
      )
    ];
    
    setRezultatiPretrage(filtrirani);
  }, [pretraga, sviFilmovi, sveSerije]);

  // Helper function to get image source
  const getImageSource = (item: Movie | Series): string | undefined => {
    if ('coverImage' in item) {
      return item.coverImage;
    }
    if ('cover_image' in item) {
      return item.cover_image;
    }
    return undefined;
  };

  const renderCard = (item: Movie | Series, tip: string) => (
    <div key={`${tip}-${item.id}`} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
      {/* Poster area */}
      <div className="relative h-64 overflow-hidden">
        {getImageSource(item) ? (
          <img 
            src={getImageSource(item)} 
            alt={item.naziv} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            onError={(e) => {
              console.log('Greška pri učitavanju slike:', e);
              // Fallback na gradient ako slika ne može da se učita
              (e.target as HTMLImageElement).style.display = 'none';
              const parent = (e.target as HTMLImageElement).parentElement;
              if (parent) {
                parent.className = "bg-gradient-to-br from-blue-500 to-purple-600 h-64 flex items-center justify-center";
                parent.innerHTML = `<span class="text-white text-3xl font-bold">${item.naziv.charAt(0)}</span>`;
              }
            }}
          />
        ) : (
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 h-64 flex items-center justify-center">
            <span className="text-white text-3xl font-bold">
              {item.naziv.charAt(0)}
            </span>
          </div>
        )}
        
        {/* Overlay sa ocenom */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded-lg text-sm font-semibold flex items-center gap-1">
          <span className="text-yellow-400">★</span>
          {item.prosecnaOcena.toFixed(1)}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
          {item.naziv}
        </h3>
        
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {tip}
          </span>
          {item.zanr && (
            <>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {item.zanr}
              </span>
            </>
          )}
        </div>
        
        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-3">
          {item.opis}
        </p>
        
        <div className="flex justify-between items-center">
          {tip === 'serija' && (
            <Link
              to={`/serije/${item.id}`}
              className="inline-block px-3 py-1 bg-cyan-500 text-white rounded-md text-xs hover:bg-cyan-600 transition-colors"
            >
              Detalji
            </Link>
          )}
          {tip === 'film' && (
            <Link
              to={`/filmovi/${item.id}`}
              className="inline-block px-3 py-1 bg-cyan-500 text-white rounded-md text-xs hover:bg-cyan-600 transition-colors"
            >
              Detalji
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  if (ucitava) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <div className="text-2xl text-gray-600 dark:text-gray-400">Učitavam podatke...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Hero sekcija */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-cyan-600 dark:text-cyan-400 mb-4">
            Dobrodošli!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Pogledajte najnovije filmove i serije!
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Pretražite filmove i serije..."
                value={pretraga}
                onChange={(e) => setPretraga(e.target.value)}
                className="w-full px-4 py-3 pl-10 pr-4 text-gray-900 bg-white dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors duration-300"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Rezultati pretrage */}
          {pretraga && rezultatiPretrage.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Rezultati pretrage
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rezultatiPretrage.map(item => 
                  renderCard(item, 'brojEpizoda' in item ? 'serija' : 'film')
                )}
              </div>
            </div>
          )}

          {pretraga && rezultatiPretrage.length === 0 && (
            <div className="mb-8">
              <p className="text-gray-600 dark:text-gray-400">
                Nema rezultata za "{pretraga}"
              </p>
            </div>
          )}
        </div>

        {/* Poruka ako nema podataka */}
        {topFilmovi.length === 0 && topSerije.length === 0 && (
          <div className="text-center mb-12">
            <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                💡 Nema podataka iz baze
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300">
                Potrebno je da povežeš MySQL bazu podataka i dodaš filmove i serije da bi video sadržaj ovde.
              </p>
            </div>
          </div>
        )}

        {/* Top 3 Filmovi */}
        {topFilmovi.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              🏆 Top 3 najbolja filma
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {topFilmovi.map(film => renderCard(film, 'film'))}
            </div>
          </section>
        )}

        {/* Top 3 Serije */}
        {topSerije.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              🏆 Top 3 najbolje serije
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {topSerije.map(serija => renderCard(serija, 'serija'))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
