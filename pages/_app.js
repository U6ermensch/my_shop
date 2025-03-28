import { CartProvider } from '../context/CartContext';
import { OrderProvider } from '../context/OrderContext';
import { AuthProvider } from '../context/AuthContext';
import { CallbackProvider } from '../context/CallbackContext';
import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <AuthProvider>
        <OrderProvider>
          <CartProvider>
            <CallbackProvider>
              <Component {...pageProps} />
            </CallbackProvider>
          </CartProvider>
        </OrderProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
