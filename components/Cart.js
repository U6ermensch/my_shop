import { useCart } from '../context/CartContext';
import { useRouter } from 'next/router';
import { HiShoppingBag } from 'react-icons/hi';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Cart() {
  const { cartItems = [], isOpen, toggleCart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const router = useRouter();
  const [deletingItems, setDeletingItems] = useState({});
  const [countdowns, setCountdowns] = useState({});
  const [progress, setProgress] = useState({});

  const totalItems = cartItems.reduce((sum, item) => sum + (item?.quantity || 0), 0);

  const handleCheckout = async () => {
    try {
      toggleCart();
      await router.push('/checkout');
    } catch (error) {
      console.error('Error navigating to checkout:', error);
    }
  };

  const handleRemoveItem = (itemId) => {
    setDeletingItems(prev => ({
      ...prev,
      [itemId]: true
    }));

    setCountdowns(prev => ({
      ...prev,
      [itemId]: 5
    }));

    setProgress(prev => ({
      ...prev,
      [itemId]: 100
    }));

    const startTime = Date.now();
    const duration = 4500; // 4.5 seconds in milliseconds

    const countdownInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.ceil((duration - elapsed) / 1000);
      const currentProgress = Math.max(0, ((duration - elapsed) / duration) * 100);

      if (elapsed >= duration) {
        clearInterval(countdownInterval);
        removeFromCart(itemId);
        setDeletingItems(prev => {
          const newState = { ...prev };
          delete newState[itemId];
          return newState;
        });
        setCountdowns(prev => ({
          ...prev,
          [itemId]: 0
        }));
        setProgress(prev => ({
          ...prev,
          [itemId]: 0
        }));
      } else {
        setCountdowns(prev => ({
          ...prev,
          [itemId]: remaining
        }));
        setProgress(prev => ({
          ...prev,
          [itemId]: currentProgress
        }));
      }
    }, 50);

    setDeletingItems(prev => ({
      ...prev,
      [itemId]: countdownInterval
    }));
  };

  const handleUndoDelete = (itemId) => {
    if (deletingItems[itemId]) {
      clearInterval(deletingItems[itemId]);
      setDeletingItems(prev => {
        const newState = { ...prev };
        delete newState[itemId];
        return newState;
      });
      setCountdowns(prev => {
        const newState = { ...prev };
        delete newState[itemId];
        return newState;
      });
      setProgress(prev => {
        const newState = { ...prev };
        delete newState[itemId];
        return newState;
      });
    }
  };

  const handleClose = (e) => {
    e.stopPropagation();
    toggleCart();
  };

  return (
    <>
      <button
        onClick={toggleCart}
        className="fixed top-[6.5rem] right-4 bg-red-700 text-white p-4 rounded-full shadow-lg hover:bg-red-800 transition-colors z-50"
      >
        <div className="relative">
          <HiShoppingBag size={32} />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-sm rounded-full h-6 w-6 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </div>
      </button>

      <div 
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleClose}
      >
        <div 
          className={`absolute right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={e => e.stopPropagation()}
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Корзина</h2>
              <button 
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="p-4 flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
            {cartItems.length === 0 ? (
              <p className="text-center text-gray-500">Корзина пуста</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-20 h-20 relative">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="80px"
                        className="object-cover rounded"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-gray-600">{item.price} ₽</p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          +
                        </button>
                        {deletingItems[item.id] ? (
                          <div className="ml-auto flex items-center gap-3">
                            <div 
                              className="relative w-6 h-6"
                              style={{
                                transform: `scale(${0.8 + (progress[item.id] || 0) * 0.002})`,
                                transition: 'transform 0.05s linear'
                              }}
                            >
                              <div className="absolute inset-0 border-2 border-gray-200 rounded-full"></div>
                              <svg className="absolute inset-0 w-full h-full -rotate-90">
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  fill="none"
                                  stroke="#EF4444"
                                  strokeWidth="2"
                                  strokeDasharray={`${(progress[item.id] || 0) * 0.6283} 62.83`}
                                  style={{
                                    transition: 'stroke-dasharray 0.05s linear'
                                  }}
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
                                {countdowns[item.id] || 0}
                              </div>
                            </div>
                            <button
                              onClick={() => handleUndoDelete(item.id)}
                              className="text-gray-900 hover:text-gray-700 font-medium"
                            >
                              Вернуть
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="ml-auto text-red-500 hover:text-red-700"
                          >
                            Удалить
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="p-4 bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Итого:</span>
              <span className="font-bold">{getCartTotal()} ₽</span>
            </div>
            <button
              className="w-full bg-red-700 text-white py-2 px-4 rounded-lg hover:bg-red-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
            >
              Оформить заказ
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 