import { useState, useMemo } from "react";
import type { Movie } from "../types/Movie";
import type { UserLoginDto } from "../models/auth/UserLoginDto";
import { useMovies } from "../hooks/useMovies";
import { useTrivias } from "../hooks/useTrivias";
import type { IMovieApiService } from "../api_services/interfaces/IMovieApiService";
import { MovieApiService } from "../api_services/services/MovieApiService";
import { MovieFilters } from "../components/movie/MovieFilters";
import { MovieCard } from "../components/movie/MovieCard";
import { AddMovieCard } from "../components/movie/AddMovieCard";
import AddMovieForm from "../components/forms/AddMovieForm";
import DeleteConfirmModal from "../components/modals/DeleteConfirmModal";

export default function KatalogFilmova() {
  const movieService: IMovieApiService = useMemo(() => new MovieApiService(), []);
  
  const {
    movies,
    sortedAndFilteredMovies,
    loading,
    error,
    sortConfig,
    filterConfig,
    setSortConfig,
    setFilterConfig,
    refreshMovies,
    deleteMovie
  } = useMovies(movieService);

  const movieIds = useMemo(() => movies.map(movie => movie.id), [movies]);
  const trivias = useTrivias(movieIds);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);
  
  const [currentUser] = useState<UserLoginDto | null>(() => {
    const userData = localStorage.getItem("korisnik");
    return userData ? JSON.parse(userData) : null;
  });

  const handleDeleteMovie = async (movie: Movie) => {
    try {
      const result = await deleteMovie(movie.id);
      if (result.success) {
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Greška pri brisanju filma:", error);
      alert("Greška pri uklanjanju filma.");
    }
    setShowDeleteModal(false);
    setMovieToDelete(null);
  };

  const openDeleteModal = (movie: Movie) => {
    setMovieToDelete(movie);
    setShowDeleteModal(true);
  };

  const handleAddMovieSuccess = () => {
    setShowAddForm(false);
    refreshMovies();
  };

  if (loading) return <div className="p-4 text-center text-gray-600 dark:text-gray-300">Učitavanje...</div>;
  if (error) return <div className="p-4 text-center text-red-600 dark:text-red-400">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Katalog filmova</h2>
      
      <MovieFilters
        sortConfig={sortConfig}
        filterConfig={filterConfig}
        onSortChange={setSortConfig}
        onFilterChange={setFilterConfig}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Add Movie Card - samo za admin korisnike */}
        {currentUser && currentUser.uloga === 'admin' && (
          <AddMovieCard onAddMovie={() => setShowAddForm(true)} />
        )}
        
        {/* Movie Cards */}
        {sortedAndFilteredMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            trivia={trivias[movie.id]}
            currentUser={currentUser}
            onRefreshMovies={refreshMovies}
            onDeleteMovie={openDeleteModal}
          />
        ))}
      </div>

      {/* Add Movie Modal */}
      {showAddForm && (
        <AddMovieForm
          onSuccess={handleAddMovieSuccess}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Delete Movie Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => movieToDelete && handleDeleteMovie(movieToDelete)}
        itemName={movieToDelete?.naziv || ""}
        itemType="film"
      />
    </div>
  );
}
