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
    triviaPitanje: '',
    triviaOdgovor: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const seriesService = ServiceFactory.getSeriesService();

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
      const result = await seriesService.createSeries(formData);
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
