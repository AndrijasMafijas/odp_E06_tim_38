import React, { useState, useEffect, useCallback } from 'react';
import { ServiceFactory } from '../../api_services/factories/ServiceFactory';
import type { UserLoginDto } from '../../models/auth/UserLoginDto';

interface KontrolnaTablaProps {
  onLogout?: () => void;
}

const KontrolnaTabla: React.FC<KontrolnaTablaProps> = () => {
  const [users, setUsers] = useState<UserLoginDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dobijanje servisa iz ServiceFactory
  const userService = ServiceFactory.getUserService();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const users = await userService.getAllUsers();
      // Konvertuj User[] u UserLoginDto[]
      const userLoginDtos: UserLoginDto[] = users.map(user => ({
        id: user.id,
        korisnickoIme: user.korisnickoIme,
        uloga: user.uloga
      }));
      setUsers(userLoginDtos);
    } catch (err) {
      console.error('Greška pri fetchUsers:', err);
      setError('Грешка при учитавању корисника.');
    } finally {
      setLoading(false);
    }
  }, [userService]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId: number, currentRole: string, newRole: 'korisnik' | 'admin') => {
    if (currentRole === newRole) return;
    
    try {
      const result = await userService.updateUserRole(userId, { uloga: newRole });
      if (result.success) {
        // Ažuriraj lokalno stanje
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, uloga: newRole } : user
        ));
        alert(result.message || 'Улога корисника је успешно ажурирана.');
      } else {
        alert(result.message || 'Грешка при ажурирању улоге.');
      }
    } catch (err) {
      console.error('Greška pri ažuriranju uloge:', err);
      alert('Грешка при ажурирању улоге корисника.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-lg text-gray-600 dark:text-gray-300">Учитавање корисника...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-lg text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🛠️ Контролна табла
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Управљајте корисницима и њиховим улогама у систему
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              👥 Корисници система ({users.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Корисничко име
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Тренутна улога
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Акције
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              {user.korisnickoIme.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.korisnickoIme}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.uloga === 'admin' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {user.uloga === 'admin' ? '🔑 Админ' : '👤 Корисник'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {user.uloga === 'admin' ? (
                        <button
                          onClick={() => handleRoleChange(user.id, user.uloga || 'korisnik', 'korisnik')}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs transition-colors duration-200"
                        >
                          ⬇️ Направи корисником
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRoleChange(user.id, user.uloga || 'korisnik', 'admin')}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs transition-colors duration-200"
                        >
                          ⬆️ Направи админом
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {users.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">📝</div>
              <p className="text-gray-600 dark:text-gray-400">Нема корисника за приказ.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KontrolnaTabla;
