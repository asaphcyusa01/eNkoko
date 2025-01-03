import React from 'react';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { formatCurrency } from '../utils/currency';

const products: Product[] = [
  {
    id: '1',
    name: 'Ibiryo by\'Inkoko by\'Umwimerere',
    description: 'Ibiryo by\'inkoko byujuje ubuziranenge',
    price: 15000,
    category: 'Ibiryo',
    image: 'https://images.unsplash.com/photo-1585666576514-f6e5f34f8bf5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '2',
    name: 'Icyuma Gitanga Ibiryo',
    description: 'Icyuma gitanga ibiryo mu buryo bw\'ikoranabuhanga',
    price: 75000,
    category: 'Ibikoresho',
    image: 'https://images.unsplash.com/photo-1597857194115-754e8e16c228?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '3',
    name: 'Urukingo rw\'Inkoko',
    description: 'Urukingo rukenewe mu kwirinda indwara',
    price: 45000,
    category: 'Ubuvuzi',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  }
];

export default function Marketplace() {
  const { dispatch } = useCart();

  const handleAddToCart = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  return (
    <div className="min-h-screen bg-primary-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Isoko</h1>
          <p className="text-xl text-gray-600">Ibikoresho by'inkoko by'umwimerere</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <span className="inline-block px-3 py-1 text-sm font-semibold text-primary-700 bg-primary-100 rounded-full mb-4">
                  {product.category}
                </span>
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary-700">
                    {formatCurrency(product.price)}
                  </span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition duration-300"
                  >
                    Shyira mu gitebo
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}