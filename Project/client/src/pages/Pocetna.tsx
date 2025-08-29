import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

interface Movie {
  id: number;
  naziv: string;
  opis: string;
  prosecnaOcena: number;
  zanr?: string;
  coverUrl?: string;
}

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

export default function Pocetna() {
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
        // Učitaj filmove i serije
        const [filmResponse, serijeResponse] = await Promise.all([
          axios.get(`${API_URL}movies`),
          axios.get(`${API_URL}series`)
        ]);

        // Sortiraj po prosečnoj oceni i uzmi top 3
        const sortedFilmovi = filmResponse.data
          .sort((a: Movie, b: Movie) => b.prosecnaOcena - a.prosecnaOcena)
          .slice(0, 3);
        
        const sortedSerije = serijeResponse.data
          .sort((a: Series, b: Series) => b.prosecnaOcena - a.prosecnaOcena)
          .slice(0, 3);

        setTopFilmovi(sortedFilmovi);
        setTopSerije(sortedSerije);
        setSviFilmovi(filmResponse.data);
        setSveSerije(serijeResponse.data);
      } catch (error) {
        console.error("Greška pri učitavanju podataka:", error);
      } finally {
        setUcitava(false);
      }
    };

    fetchData();
  }, []);

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

  const renderStars = (ocena: number) => {
    const zvezde = [];
    const puneZvezde = Math.floor(ocena);
    const poluZvezda = ocena % 1 >= 0.5;
    
    for (let i = 0; i < puneZvezde; i++) {
      zvezde.push(<span key={i} className="text-yellow-400">★</span>);
    }
    
    if (poluZvezda) {
      zvezde.push(<span key="half" className="text-yellow-400">★</span>);
    }
    
    const preostaleZvezde = 5 - Math.ceil(ocena);
    for (let i = 0; i < preostaleZvezde; i++) {
      zvezde.push(<span key={`empty-${i}`} className="text-gray-300 dark:text-gray-600">★</span>);
    }
    
    return zvezde;
  };

  const renderCard = (item: Movie | Series, tip: 'film' | 'serija') => (
    <div key={`${tip}-${item.id}`} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      {/* Poster area */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 h-64 rounded-t-lg flex items-center justify-center">
        <span className="text-white text-3xl font-bold">
          {item.naziv.charAt(0)}
        </span>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 truncate">
          {item.naziv}
        </h3>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="flex">{renderStars(item.prosecnaOcena)}</div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            ({item.prosecnaOcena.toFixed(1)})
          </span>
        </div>
        
        {'brojSezona' in item && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {item.brojSezona} sezona{item.brojSezona !== 1 ? 'a' : ''}
          </p>
        )}
        
        <p className="text-sm text-gray-700 dark:text-gray-300 overflow-hidden h-16" style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          textOverflow: 'ellipsis'
        }}>
          {item.opis}
        </p>
        
        {tip === 'serija' && (
          <Link 
            to={`/serije/${item.id}`}
            className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
          >
            Погледај детаље
          </Link>
        )}
      </div>
    </div>
  );

  if (ucitava) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <div className="text-2xl text-gray-600 dark:text-gray-400">Учитавам податке...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Hero sekcija */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Добродошли!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Погледајте најновије филмове и серије!
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Претражите филмове и серије..."
                value={pretraga}
                onChange={(e) => setPretraga(e.target.value)}
                className="w-full px-4 py-3 pl-10 pr-4 text-gray-900 bg-white dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
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
                Резултати претраге
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rezultatiPretrage.map(item => 
                  renderCard(item, 'brojSezona' in item ? 'serija' : 'film')
                )}
              </div>
            </div>
          )}

          {pretraga && rezultatiPretrage.length === 0 && (
            <div className="mb-8">
              <p className="text-gray-600 dark:text-gray-400">
                Нема резултата за "{pretraga}"
              </p>
            </div>
          )}
        </div>

        {/* Poruka ako nema podataka */}
        {topFilmovi.length === 0 && topSerije.length === 0 && (
          <div className="text-center mb-12">
            <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                💡 Нема података из базе
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300">
                Потребно је да повежеш MySQL базу података и додаш филмове и серије да би видео садржај овде.
              </p>
            </div>
          </div>
        )}

        {/* Top 3 Filmovi */}
        {topFilmovi.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              🏆 Топ 3 најбоља филма
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
              🏆 Топ 3 најбоље серије
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
