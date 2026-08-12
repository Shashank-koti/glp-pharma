import React, { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

export function useCompare() {
  return useContext(CompareContext);
}

export function CompareProvider({ children }) {
  const [compareItems, setCompareItems] = useState(() => {
    try {
      const saved = localStorage.getItem('glp_compare');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('glp_compare', JSON.stringify(compareItems));
  }, [compareItems]);

  const addToCompare = (product) => {
    setCompareItems(prev => {
      // Check if it already exists
      if (prev.some(item => item._id === product._id)) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromCompare = (id) => {
    setCompareItems(prev => prev.filter(item => item._id !== id));
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  return (
    <CompareContext.Provider value={{
      compareItems,
      addToCompare,
      removeFromCompare,
      clearCompare,
      compareCount: compareItems.length
    }}>
      {children}
    </CompareContext.Provider>
  );
}
