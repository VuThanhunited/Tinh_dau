import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('essential_cart');
    const storedWishlist = localStorage.getItem('essential_wishlist');
    if (storedCart) {
      try { setCartItems(JSON.parse(storedCart)); } catch (e) {}
    }
    if (storedWishlist) {
      try { setWishlistItems(JSON.parse(storedWishlist)); } catch (e) {}
    }
  }, []);

  // Save changes to localStorage
  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('essential_cart', JSON.stringify(items));
  };

  const saveWishlist = (items) => {
    setWishlistItems(items);
    localStorage.setItem('essential_wishlist', JSON.stringify(items));
  };

  // Add to cart
  const addToCart = (product, quantity = 1) => {
    const existingItem = cartItems.find(item => item._id === product._id);
    let newItems;
    if (existingItem) {
      newItems = cartItems.map(item =>
        item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      newItems = [...cartItems, { ...product, quantity }];
    }
    saveCart(newItems);
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    const newItems = cartItems.filter(item => item._id !== productId);
    saveCart(newItems);
  };

  // Update cart item quantity
  const updateQuantity = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    const newItems = cartItems.map(item =>
      item._id === productId ? { ...item, quantity: qty } : item
    );
    saveCart(newItems);
  };

  // Toggle item in Wishlist
  const toggleWishlist = (product) => {
    const exists = wishlistItems.some(item => item._id === product._id);
    let newWishlist;
    if (exists) {
      newWishlist = wishlistItems.filter(item => item._id !== product._id);
    } else {
      newWishlist = [...wishlistItems, product];
    }
    saveWishlist(newWishlist);
  };

  // Get total price
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.salePrice * item.quantity), 0);
  };

  // Currency formatting helper (e.g. 220000 -> "220.000đ")
  const formatVND = (number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(number).replace('₫', 'đ');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlistItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleWishlist,
        getCartTotal,
        formatVND
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
