import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Checkout() {
  const { cartItems = [], getCartTotal, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    comment: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        items: cartItems,
        total: getCartTotal(),
        customerInfo: formData,
        orderDate: new Date().toISOString()
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      // Очищаем корзину
      clearCart();

      // Показываем сообщение об успехе
      alert('Заказ успешно оформлен! Мы свяжемся с вами в ближайшее время.');

      // Перенаправляем на главную страницу
      router.push('/');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h1 className="text-2xl font-semibold mb-4">Корзина пуста</h1>
            <p className="text-gray-600 mb-4">Добавьте товары в корзину, чтобы оформить заказ</p>
            <button
              onClick={() => router.push('/')}
              className="bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-800 transition-colors"
            >
              Вернуться к меню
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6">Оформление заказа</h1>
            
            {/* Список товаров */}
            <div className="mb-8 bg-gray-50 p-4 rounded-lg">
              <h2 className="font-semibold mb-4">Ваш заказ:</h2>
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.title} × {item.quantity}</span>
                    <span>{item.price * item.quantity} ₽</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-4 font-semibold flex justify-between">
                  <span>Итого:</span>
                  <span>{getCartTotal()} ₽</span>
                </div>
              </div>
            </div>

            {/* Форма оформления */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Имя
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Телефон
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Адрес доставки
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                  Комментарий к заказу
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ← Вернуться к меню
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-red-700 text-white px-8 py-3 rounded-lg transition-colors ${
                    isSubmitting 
                      ? 'opacity-75 cursor-not-allowed' 
                      : 'hover:bg-red-800'
                  }`}
                >
                  {isSubmitting ? 'Оформление...' : 'Оформить заказ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 