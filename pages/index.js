import { Geist } from "next/font/google";
import { useState } from 'react';
import ProductCard from "../components/ProductCard";
import Cart from "../components/Cart";
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Head from 'next/head';

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const products = [
  {
    id: 1,
    title: "Люля-кебаб",
    price: 350,
    imageUrl: "/images/lula-kebab.jpg",
    description: "Сочный люля-кебаб из баранины с луком и специями"
  },
  {
    id: 2,
    title: "Шашлык из баранины",
    price: 450,
    imageUrl: "/images/lamb-kebab.jpg",
    description: "Маринованный шашлык из отборной баранины"
  },
  {
    id: 3,
    title: "Шашлык из курицы",
    price: 320,
    imageUrl: "/images/chicken-kebab.jpg",
    description: "Нежный шашлык из куриного филе в специальном маринаде"
  },
  {
    id: 4,
    title: "Долма",
    price: 320,
    imageUrl: "/images/dolma.jpg",
    description: "Виноградные листья, фаршированные рисом и мясом"
  },
  {
    id: 5,
    title: "Хачапури по-аджарски",
    price: 380,
    imageUrl: "/images/adjarian-khachapuri.jpg",
    description: "Традиционный грузинский хачапури в форме лодочки с яйцом"
  },
  {
    id: 6,
    title: "Плов",
    price: 340,
    imageUrl: "/images/plov.jpg",
    description: "Ароматный плов с бараниной и восточными специями"
  },
  {
    id: 7,
    title: "Шаурма",
    price: 290,
    imageUrl: "/images/shawarma.jpg",
    description: "Сочная шаурма с курицей, овощами и соусом"
  },
  {
    id: 8,
    title: "Лагман",
    price: 360,
    imageUrl: "/images/lagman.jpg",
    description: "Домашняя лапша с мясом, овощами и ароматным бульоном"
  },
  {
    id: 9,
    title: "Манты",
    price: 330,
    imageUrl: "/images/manti.jpg",
    description: "Сочные манты с говядиной и луком"
  }
];

export default function Home() {
  const { cartItems = [], toggleCart } = useCart();
  const cartItemCount = cartItems.reduce((sum, item) => sum + (item?.quantity || 0), 0);

  return (
    <div className={`min-h-screen bg-white ${geist.variable}`}>
      <Head>
        <title>Ресторан кавказской кухни</title>
        <meta name="description" content="Лучшие блюда кавказской кухни с доставкой" />
      </Head>

      <Header cartItemCount={cartItemCount} onCartClick={toggleCart} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Меню</h2>
        
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
            />
          ))}
        </div>
      </main>

      <Cart />
      <Footer />
    </div>
  );
}
