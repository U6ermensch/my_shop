import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();
const CART_STORAGE_KEY = 'shop_cart';

// Функция для загрузки корзины из localStorage
const loadCartFromStorage = () => {
  if (typeof window === 'undefined') return [];
  
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error loading cart from storage:', error);
    return [];
  }
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Загружаем корзину при первом рендере
  useEffect(() => {
    setCartItems(loadCartFromStorage());
  }, []);

  // Сохраняем корзину при каждом изменении
  useEffect(() => {
    if (cartItems.length > 0 || localStorage.getItem(CART_STORAGE_KEY)) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  // Добавить товар в корзину
  const addToCart = (product) => {
    setCartItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Если товар уже есть в корзине, увеличиваем количество
        return currentItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      // Если товара нет в корзине, добавляем его
      return [...currentItems, { ...product, quantity: 1 }];
    });
  };

  // Удалить товар из корзины
  const removeFromCart = (productId) => {
    setCartItems(currentItems =>
      currentItems.filter(item => item.id !== productId)
    );
  };

  // Изменить количество товара
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(currentItems =>
      currentItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Очистить корзину
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  // Получить общее количество товаров в корзине
  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Получить общую сумму корзины
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      isOpen,
      toggleCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartCount,
      getCartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 