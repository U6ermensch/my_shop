import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function ProductCard({ id, title, price, imageUrl, description }) {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[450px]">
      <div className="relative h-56">
        {!imageError ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">Фото скоро появится</span>
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 flex-grow">{description}</p>
        <div className="mt-auto">
          <p className="text-xl mb-4">{price} ₽</p>
          <button
            onClick={() => addToCart({ id, title, price, imageUrl })}
            className="w-full bg-red-700 text-white py-2 px-4 rounded-lg hover:bg-red-800 transition-colors"
          >
            Заказать
          </button>
        </div>
      </div>
    </div>
  );
} 