import { useState } from 'react';
import { useCallbacks } from '../context/CallbackContext';

export default function CallbackModal({ isOpen, onClose }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { addCallback } = useCallbacks();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/callbacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          phone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при отправке');
      }

      const data = await response.json();
      addCallback(data);
      alert('Спасибо! Мы перезвоним вам в течение 5 минут.');
      setName('');
      setPhone('');
      onClose();
    } catch (error) {
      console.error('Error submitting callback:', error);
      setError(error.message || 'Произошла ошибка. Пожалуйста, попробуйте позже или позвоните нам.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-semibold">Закажите звонок</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">
          И мы перезвоним вам в течение 5 минут.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded text-sm">
              {error}
            </div>
          )}
          
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ваше имя"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-red-700"
              required
            />
          </div>
          
          <div className="flex">
            <span className="bg-gray-100 p-3 border border-r-0 border-gray-300 rounded-l">
              +7
            </span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(999) 999-99-99"
              className="flex-1 p-3 border border-l-0 border-gray-300 rounded-r focus:outline-none focus:border-red-700"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-700 text-white py-3 rounded hover:bg-red-800 transition-colors disabled:bg-gray-400"
          >
            {isSubmitting ? 'Отправка...' : 'Заказать'}
          </button>

          <p className="text-xs text-gray-500 text-center">
            Нажимая на кнопку «Отправить заявку», вы даете{' '}
            <a href="#" className="text-red-700 hover:underline">
              согласие на обработку персональных данных
            </a>
          </p>
        </form>
      </div>
    </div>
  );
} 