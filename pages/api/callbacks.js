import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

// В реальном приложении здесь должно быть подключение к базе данных
let callbacks = [];

export default async function handler(req, res) {
  // Для POST запросов (создание заявки) не требуем авторизации
  if (req.method === 'POST') {
    try {
      const { name, phone } = req.body;
      
      if (!name || !phone) {
        return res.status(400).json({ error: 'Имя и телефон обязательны для заполнения' });
      }

      // Простая валидация номера телефона
      const phoneRegex = /^\+?[0-9]{10,12}$/;
      if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
        return res.status(400).json({ error: 'Неверный формат номера телефона' });
      }

      const newCallback = {
        id: Date.now().toString(),
        name,
        phone,
        status: 'new',
        createdAt: new Date().toISOString(),
      };

      callbacks.push(newCallback);
      return res.status(201).json(newCallback);
    } catch (error) {
      console.error('Error creating callback:', error);
      return res.status(500).json({ error: 'Ошибка при создании заявки' });
    }
  }

  // Для всех остальных запросов требуем авторизацию
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // GET - получение списка заявок
  if (req.method === 'GET') {
    return res.status(200).json(callbacks);
  }

  // PUT - обновление статуса заявки
  if (req.method === 'PUT') {
    try {
      const { id } = req.query;
      const { status } = req.body;

      if (!id || !status) {
        return res.status(400).json({ error: 'ID и статус обязательны' });
      }

      const callbackIndex = callbacks.findIndex(cb => cb.id === id);
      
      if (callbackIndex === -1) {
        return res.status(404).json({ error: 'Заявка не найдена' });
      }

      callbacks[callbackIndex] = {
        ...callbacks[callbackIndex],
        status,
      };

      return res.status(200).json(callbacks[callbackIndex]);
    } catch (error) {
      console.error('Error updating callback:', error);
      return res.status(500).json({ error: 'Ошибка при обновлении статуса' });
    }
  }

  // DELETE - удаление заявки
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'ID обязателен' });
      }

      const callbackIndex = callbacks.findIndex(cb => cb.id === id);
      
      if (callbackIndex === -1) {
        return res.status(404).json({ error: 'Заявка не найдена' });
      }

      callbacks = callbacks.filter(cb => cb.id !== id);
      return res.status(200).json({ message: 'Заявка успешно удалена' });
    } catch (error) {
      console.error('Error deleting callback:', error);
      return res.status(500).json({ error: 'Ошибка при удалении заявки' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
} 