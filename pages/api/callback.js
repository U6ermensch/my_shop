export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, phone, date } = req.body;

    // Данные будут сохраняться через CallbackContext
    // в локальное хранилище на клиенте

    return res.status(200).json({ 
      message: 'Success',
      data: { name, phone, date }
    });
  } catch (error) {
    console.error('Error processing callback request:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 