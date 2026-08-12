import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('glp_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('glp_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product._id);
      if (existing) {
        return prev.map(item => 
          item.id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      
      return [...prev, {
        id: product._id,
        name: product.name,
        type: product.category?.categoryName || product.productType || 'API Impurity',
        cas: product.casNumber || 'N/A',
        catalog: product.catalogueNumber || `GLP-${product._id.substring(0, 5).toUpperCase()}`,
        quantity: 1,
        unit: 'mg',
        image: product.image
      }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, change) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = item.quantity + change;
        return { ...item, quantity: newQ > 0 ? newQ : 1 };
      }
      return item;
    }));
  };

  const updateItem = (id, field, value) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateItem,
      clearCart,
      cartCount: cartItems.length
    }}>
      {children}
    </CartContext.Provider>
  );
}
