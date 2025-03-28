import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import CallbackModal from './CallbackModal';

export default function Header({ cartItemCount, onCartClick }) {
  const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Логотип */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="Логотип"
              width={160}
              height={80}
              className="h-16 w-auto"
            />
          </Link>

          {/* Контактная информация */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-8 mb-2">
              <div className="text-gray-600">
                г. Москва, ул. Пушкина, д. 10
              </div>
              <div className="flex flex-col">
                <a href="tel:+74951234567" className="text-gray-800 hover:text-red-700">
                  +7 (495) 123-45-67
                </a>
                <a href="tel:+74951234568" className="text-gray-800 hover:text-red-700">
                  +7 (495) 123-45-68
                </a>
              </div>
            </div>
            <button
              onClick={() => setIsCallbackModalOpen(true)}
              className="bg-red-700 text-white px-6 py-3 rounded-lg hover:bg-red-800 transition-colors text-lg font-medium"
            >
              Заказать звонок
            </button>
          </div>
        </div>

        {/* Основная навигация */}
        <nav className="flex items-center justify-center mt-6">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-red-700 text-lg">МЕНЮ</Link>
            <Link href="/about" className="text-gray-700 hover:text-red-700 text-lg">О РЕСТОРАНЕ</Link>
            <Link href="/delivery" className="text-gray-700 hover:text-red-700 text-lg">ДОСТАВКА И ОПЛАТА</Link>
            <Link href="/promotions" className="text-gray-700 hover:text-red-700 text-lg">АКЦИИ</Link>
            <Link href="/contacts" className="text-gray-700 hover:text-red-700 text-lg">КОНТАКТЫ</Link>
          </div>
        </nav>
      </div>

      <CallbackModal 
        isOpen={isCallbackModalOpen}
        onClose={() => setIsCallbackModalOpen(false)}
      />
    </header>
  );
} 