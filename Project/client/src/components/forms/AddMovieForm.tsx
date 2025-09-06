import React, { useState, useMemo } from 'react';
import type { CreateMovieDto } from '../../types/Movie';
import type { IMovieApiService } from '../../api_services/interfaces/IMovieApiService';
import { MovieApiService } from '../../api_services/services/MovieApiService';
import { FormInput } from '../form/FormInput';
import { FormTextarea } from '../form/FormTextarea';
import { FormButtons } from '../form/FormButtons';

interface AddMovieFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddMovieForm: React.FC<AddMovieFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<CreateMovieDto>({
    naziv: '',
    opis: '',
    zanr: '',
    trajanje: '',
    godinaIzdanja: '',
    cover_image: '',
    triviaPitanje: '',
    triviaOdgovor: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');

  const movieService: IMovieApiService = useMemo(() => new MovieApiService(), []);

  // Funkcija za konvertovanje fajla u base64
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Sačuvaj ceo data URL format umesto samo base64 dela
        setFormData(prev => ({ ...prev, cover_image: result }));
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFileName('');
      setFormData(prev => ({ ...prev, cover_image: '' }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Pripremi podatke za slanje
      let cover_image_base64 = '';
      if (formData.cover_image) {
        // Ako je data URL format, uzmi samo base64 deo
        if (formData.cover_image.startsWith('data:')) {
          cover_image_base64 = formData.cover_image.split(',')[1];
        } else {
          cover_image_base64 = formData.cover_image;
        }
      }

      const movieData = {
        ...formData,
        cover_image: cover_image_base64
      };

      const result = await movieService.createMovie(movieData);
      if (result.success) {
        onSuccess();
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('Greška pri dodavanju filma:', err);
      setError('Greška pri dodavanju filma');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-md">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Dodaj novi film</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Naziv"
            name="naziv"
            value={formData.naziv}
            onChange={handleChange}
            required
          />

          <FormTextarea
            label="Opis"
            name="opis"
            value={formData.opis}
            onChange={handleChange}
            required
            rows={3}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label="Trajanje (min)"
              name="trajanje"
              value={formData.trajanje || ''}
              onChange={handleChange}
            />

            <FormInput
              label="Godina izdanja"
              name="godinaIzdanja"
              type="number"
              value={formData.godinaIzdanja || ''}
              onChange={handleChange}
              min="1900"
              max={new Date().getFullYear() + 5}
            />
          </div>

          <FormInput
            label="Žanr"
            name="zanr"
            value={formData.zanr || ''}
            onChange={handleChange}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Slika naslovnice
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
            />
            {selectedFileName && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                ✓ Izabrana slika: {selectedFileName}
              </p>
            )}
            {!selectedFileName && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Opcional - odaberite sliku za film
              </p>
            )}
            
            {/* Prikaz izabrane slike */}
            {formData.cover_image && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pregled slike:</p>
                <div className="w-32 h-20 border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                  <img
                    src={formData.cover_image}
                    alt="Pregled filma"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          <FormTextarea
            label="Trivia pitanje"
            name="triviaPitanje"
            value={formData.triviaPitanje || ''}
            onChange={handleChange}
            required
            rows={2}
          />

          <FormInput
            label="Trivia odgovor"
            name="triviaOdgovor"
            value={formData.triviaOdgovor || ''}
            onChange={handleChange}
            required
          />

          {error && <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>}

          <FormButtons
            primaryText="Dodaj film"
            secondaryText="Otkaži"
            onPrimaryClick={() => {}}
            onSecondaryClick={onCancel}
            primaryDisabled={loading}
            loading={loading}
          />
        </form>
      </div>
    </div>
  );
};

export default AddMovieForm;
