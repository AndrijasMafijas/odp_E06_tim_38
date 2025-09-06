import React, { useState } from 'react';
import type { CreateSeriesDto } from '../../types/Series';
import { ServiceFactory } from '../../api_services/factories/ServiceFactory';

interface AddSeriesFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddSeriesForm: React.FC<AddSeriesFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<CreateSeriesDto>({
    naziv: '',
    opis: '',
    zanr: '',
    brojSezona: 1,
    brojEpizoda: 1,
    godinaIzdanja: new Date().getFullYear(),
    status: 'ongoing',
    cover_image: '',
    triviaPitanje: '',
    triviaOdgovor: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');

  const seriesService = ServiceFactory.getSeriesService();

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ['brojSezona', 'brojEpizoda', 'godinaIzdanja'].includes(name) 
        ? parseInt(value) || 0 
        : value
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

      const seriesData = {
        ...formData,
        cover_image: cover_image_base64
      };

      const result = await seriesService.createSeries(seriesData);
      if (result.success) {
        onSuccess();
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('Greška pri dodavanju serije:', err);
      setError('Greška pri dodavanju serije');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-md">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Dodaj novu seriju</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Naziv *
            </label>
            <input
              type="text"
              name="naziv"
              value={formData.naziv}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Opis *
            </label>
            <textarea
              name="opis"
              value={formData.opis}
              onChange={handleChange}
              required
              rows={3}
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Broj epizoda *
              </label>
              <input
                type="number"
                name="brojEpizoda"
                value={formData.brojEpizoda}
                onChange={handleChange}
                required
                min="1"
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Godina izdanja
              </label>
              <input
                type="number"
                name="godinaIzdanja"
                value={formData.godinaIzdanja}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear() + 5}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Žanr
            </label>
            <input
              type="text"
              name="zanr"
              value={formData.zanr}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Slika naslovnice
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {selectedFileName && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                ✓ Izabrana slika: {selectedFileName}
              </p>
            )}
            {!selectedFileName && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Opcional - odaberite sliku za seriju
              </p>
            )}
            
            {/* Prikaz izabrane slike */}
            {formData.cover_image && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pregled slike:</p>
                <div className="w-32 h-20 border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                  <img
                    src={formData.cover_image}
                    alt="Pregled serije"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Trivia pitanje *
            </label>
            <textarea
              name="triviaPitanje"
              value={formData.triviaPitanje}
              onChange={handleChange}
              required
              rows={2}
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Trivia odgovor *
            </label>
            <input
              type="text"
              name="triviaOdgovor"
              value={formData.triviaOdgovor}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Snimanje...' : 'Dodaj seriju'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Otkaži
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSeriesForm;
