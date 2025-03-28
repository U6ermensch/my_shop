import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CallbackContext = createContext();

export function CallbackProvider({ children }) {
  const [callbacks, setCallbacks] = useState([]);

  // Загружаем сохраненные заявки при инициализации
  useEffect(() => {
    loadCallbacks();
  }, []);

  // Сохраняем заявки при изменении
  useEffect(() => {
    localStorage.setItem('callbacks', JSON.stringify(callbacks));
  }, [callbacks]);

  // Функция загрузки заявок из localStorage
  const loadCallbacks = useCallback(() => {
    const savedCallbacks = localStorage.getItem('callbacks');
    if (savedCallbacks) {
      setCallbacks(JSON.parse(savedCallbacks));
    }
  }, []);

  const addCallback = (callbackData) => {
    const newCallback = {
      id: Date.now().toString(),
      ...callbackData,
      status: 'new'
    };
    setCallbacks(prevCallbacks => [...prevCallbacks, newCallback]);
  };

  const updateCallbackStatus = (callbackId, newStatus) => {
    setCallbacks(prevCallbacks =>
      prevCallbacks.map(callback =>
        callback.id === callbackId
          ? { ...callback, status: newStatus }
          : callback
      )
    );
  };

  const deleteCallback = (callbackId) => {
    setCallbacks(prevCallbacks =>
      prevCallbacks.filter(callback => callback.id !== callbackId)
    );
  };

  // Функция для обновления данных
  const refreshCallbacks = useCallback(() => {
    loadCallbacks();
  }, [loadCallbacks]);

  return (
    <CallbackContext.Provider 
      value={{ 
        callbacks, 
        addCallback, 
        updateCallbackStatus,
        deleteCallback,
        refreshCallbacks
      }}
    >
      {children}
    </CallbackContext.Provider>
  );
}

export function useCallbacks() {
  const context = useContext(CallbackContext);
  if (!context) {
    throw new Error('useCallbacks must be used within a CallbackProvider');
  }
  return context;
} 