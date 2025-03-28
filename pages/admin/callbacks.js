import { useState, useEffect } from 'react';
import AdminProtected from '../../components/AdminProtected';
import { useSession } from 'next-auth/react';

export default function AdminCallbacks() {
  const [callbacks, setCallbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  const fetchCallbacks = async () => {
    try {
      const response = await fetch('/api/callbacks', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch callbacks');
      }
      
      const data = await response.json();
      setCallbacks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching callbacks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchCallbacks();
    }
  }, [session]);

  const handleStatusUpdate = async (id, status) => {
    try {
      const response = await fetch(`/api/callbacks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update status');
      }
      
      setCallbacks(callbacks.map(callback => 
        callback.id === id ? { ...callback, status } : callback
      ));
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/callbacks/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete callback');
      }
      
      setCallbacks(callbacks.filter(callback => callback.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting callback:', err);
    }
  };

  if (loading) {
    return (
      <AdminProtected>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Загрузка...</div>
        </div>
      </AdminProtected>
    );
  }

  if (error) {
    return (
      <AdminProtected>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl text-red-600">
            Ошибка: {error}
            <button
              onClick={fetchCallbacks}
              className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </AdminProtected>
    );
  }

  return (
    <AdminProtected>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Заявки на обратный звонок</h1>
        {callbacks.length === 0 ? (
          <p>Нет заявок на обратный звонок</p>
        ) : (
          <div className="grid gap-4">
            {callbacks.map((callback) => (
              <div key={callback.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{callback.name}</p>
                    <p className="text-gray-600">{callback.phone}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(callback.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={callback.status}
                      onChange={(e) => handleStatusUpdate(callback.id, e.target.value)}
                      className="px-2 py-1 border rounded"
                    >
                      <option value="new">Новая</option>
                      <option value="processing">В обработке</option>
                      <option value="completed">Завершена</option>
                    </select>
                    <button
                      onClick={() => handleDelete(callback.id)}
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminProtected>
  );
} 