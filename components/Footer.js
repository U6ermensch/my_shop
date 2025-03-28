import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white shadow-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          {/* Левая часть с логотипом */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="text-2xl font-bold text-red-700">Шашлычка</div>
            </Link>
          </div>

          {/* Правая часть с контактами */}
          <div className="text-right">
            <p className="text-gray-600 mb-1">г. Иркутск, ул. Верхняя наб., 145/14</p>
            <div className="space-y-1">
              <p className="text-gray-800">
                <span className="text-gray-600">Заказ доставки: </span>
                <a href="tel:+73952640112" className="hover:text-red-700">+7 (3952) 640-112</a>
              </p>
              <p className="text-gray-800">
                <span className="text-gray-600">Бронирование столов: </span>
                <a href="tel:+73952977880" className="hover:text-red-700">+7 (3952) 977-880</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 