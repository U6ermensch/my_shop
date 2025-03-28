import { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();
const ORDERS_STORAGE_KEY = 'shop_orders';

// Функция для загрузки заказов из localStorage
const loadOrdersFromStorage = () => {
  if (typeof window === 'undefined') return [];
  
  try {
    const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
    return savedOrders ? JSON.parse(savedOrders) : [];
  } catch (error) {
    console.error('Error loading orders from storage:', error);
    return [];
  }
};

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);

  // Загружаем заказы при первом рендере
  useEffect(() => {
    setOrders(loadOrdersFromStorage());
  }, []);

  // Сохраняем заказы при каждом изменении
  useEffect(() => {
    if (orders.length > 0 || localStorage.getItem(ORDERS_STORAGE_KEY)) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    }
  }, [orders]);

  // Добавить новый заказ
  const addOrder = (orderData) => {
    const newOrder = {
      id: Date.now(),
      ...orderData,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    
    setOrders(currentOrders => [newOrder, ...currentOrders]);
    return newOrder;
  };

  // Обновить статус заказа
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(currentOrders =>
      currentOrders.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  return (
    <OrderContext.Provider value={{
      orders,
      addOrder,
      updateOrderStatus
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
} 