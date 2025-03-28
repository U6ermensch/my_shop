import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import AdminProtected from '../../components/AdminProtected';

export default function AdminOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error('Error fetching orders:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Устанавливаем интервал обновления каждые 10 секунд
    const interval = setInterval(fetchOrders, 10000);

    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(interval);
  }, []);

  return (
    <AdminProtected>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold mb-6">Заказы</h1>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="text-gray-600">Загрузка заказов...</div>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-600">Нет заказов</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium">Заказ #{order.id}</h3>
                      <p className="text-gray-600">
                        {new Date(order.orderDate).toLocaleString('ru-RU')}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium mb-2">Информация о клиенте:</h4>
                    <p>Имя: {order.customerInfo.name}</p>
                    <p>Телефон: {order.customerInfo.phone}</p>
                    <p>Адрес: {order.customerInfo.address}</p>
                    {order.customerInfo.comment && (
                      <p>Комментарий: {order.customerInfo.comment}</p>
                    )}
                  </div>

                  <div className="border-t border-gray-200 mt-4 pt-4">
                    <h4 className="font-medium mb-2">Состав заказа:</h4>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span>{item.title} × {item.quantity}</span>
                          <span>{item.price * item.quantity} ₽</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between font-medium">
                      <span>Итого:</span>
                      <span>{order.total} ₽</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminProtected>
  );
} 