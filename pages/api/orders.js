import { getSession } from 'next-auth/react';

// Временное хранилище заказов (в реальном приложении должна быть база данных)
let orders = [];

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Возвращаем список заказов
    res.status(200).json(orders);
  } 
  else if (req.method === 'POST') {
    try {
      const order = req.body;
      
      // Добавляем ID и дату создания
      const newOrder = {
        id: Date.now().toString(),
        ...order,
        status: 'new',
        createdAt: new Date().toISOString()
      };

      // Добавляем заказ в начало массива
      orders.unshift(newOrder);

      res.status(201).json(newOrder);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  }
  else if (req.method === 'PUT') {
    try {
      const { orderId, status } = req.body;
      
      // Находим и обновляем статус заказа
      orders = orders.map(order => 
        order.id === orderId 
          ? { ...order, status } 
          : order
      );

      res.status(200).json({ message: 'Order updated successfully' });
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({ error: 'Failed to update order' });
    }
  }
  else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 