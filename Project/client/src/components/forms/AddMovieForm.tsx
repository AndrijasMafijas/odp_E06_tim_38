import React, { useState } from 'react';
import type { CreateMovieDto } from '../../types/Movie';
import { ServiceFactory } from '../../api_services/factories/ServiceFactory';
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
    triviaPitanje: '',
    triviaOdgovor: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const movieService = ServiceFactory.getMovieService();

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
      const result = await movieService.createMovie(formData);
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

          <FormInput
            label="URL slike naslovnice"
            name="coverImage"
            value={formData.coverImage || ''}
            onChange={handleChange}
            placeholder="https://example.com/slika.jpg"
          />

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
