import { useState } from "react";

interface AddEpisodeFormProps {
  seriesId: number;
  onClose: () => void;
  onSuccess: () => void;
}

interface EpisodeFormData {
  naziv: string;
  opis: string;
  trajanje: number;
  brojEpizode: number;
  cover_image: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export default function AddEpisodeForm({ seriesId, onClose, onSuccess }: AddEpisodeFormProps) {
  const [formData, setFormData] = useState<EpisodeFormData>({
    naziv: "",
    opis: "",
    trajanje: 0,
    brojEpizode: 1,
    cover_image: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

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
      setSelectedFileName("");
      setFormData(prev => ({ ...prev, cover_image: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validacija
    if (!formData.naziv.trim()) {
      setError("Naziv epizode je obavezan");
      setLoading(false);
      return;
    }

    if (!formData.opis.trim()) {
      setError("Opis epizode je obavezan");
      setLoading(false);
      return;
    }

    if (!formData.trajanje || formData.trajanje <= 0) {
      setError("Trajanje mora biti veće od 0 minuta");
      setLoading(false);
      return;
    }

    if (!formData.brojEpizode || formData.brojEpizode <= 0) {
      setError("Broj epizode mora biti veći od 0");
      setLoading(false);
      return;
    }

    try {
      // Pripremi podatke za slanje
      let cover_image_base64 = "";
      if (formData.cover_image) {
        // Ako je data URL format, uzmi samo base64 deo
        if (formData.cover_image.startsWith('data:')) {
          cover_image_base64 = formData.cover_image.split(',')[1];
        } else {
          cover_image_base64 = formData.cover_image;
        }
      }

      const episodeData = {
        naziv: formData.naziv.trim(),
        opis: formData.opis.trim(),
        trajanje: formData.trajanje,
        brojEpizode: formData.brojEpizode,
        serijaId: seriesId,
        prosecnaOcena: 0,
        cover_image: cover_image_base64
      };

      console.log('Šaljem na URL:', `${API_URL}episodes/public`);
      console.log('Episode data:', episodeData);

      const response = await fetch(`${API_URL}episodes/public`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(episodeData)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Greška pri dodavanju epizode');
      }

      const result = await response.json();
      console.log('Success result:', result);

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Greška pri dodavanju epizode');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Dodaj novu epizodu
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Naziv epizode
              </label>
              <input
                type="text"
                value={formData.naziv}
                onChange={(e) => setFormData(prev => ({ ...prev, naziv: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Unesite naziv epizode"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Opis epizode
              </label>
              <textarea
                value={formData.opis}
                onChange={(e) => setFormData(prev => ({ ...prev, opis: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Unesite opis epizode"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Trajanje (min)
                </label>
                <input
                  type="text"
                  value={formData.trajanje || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Dozvoli samo brojeve
                    if (value === "" || /^\d+$/.test(value)) {
                      setFormData(prev => ({ ...prev, trajanje: value === "" ? 0 : parseInt(value) }));
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="45"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Broj epizode
                </label>
                <input
                  type="text"
                  value={formData.brojEpizode || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Dozvoli samo brojeve
                    if (value === "" || /^\d+$/.test(value)) {
                      setFormData(prev => ({ ...prev, brojEpizode: value === "" ? 1 : parseInt(value) }));
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Slika epizode
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
                  Opcional - odaberite sliku za epizodu
                </p>
              )}
              
              {/* Prikaz izabrane slike */}
              {formData.cover_image && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pregled slike:</p>
                  <div className="w-32 h-20 border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                    <img
                      src={formData.cover_image}
                      alt="Pregled epizode"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                disabled={loading}
              >
                Otkaži
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Dodajem...
                  </>
                ) : (
                  "Dodaj epizodu"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
